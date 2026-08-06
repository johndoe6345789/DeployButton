#include "JsonUtil.h"
#include "RunsRepo.h"
#include <algorithm>

using namespace drogon::orm;

namespace {
// Drops leading chars through the first '\n' in `text`, so a chunk fetched
// from an arbitrary offset always starts at a line boundary (never
// mid-line/mid-ANSI-sequence). Returns unchanged if `offset` is already 0
// (true log start) or `text` has no newline to snap to.
struct SnappedChunk {
    std::string text;
    long long offset;
};

SnappedChunk snapToLineStart(std::string text, long long offset) {
    if (offset == 0) return {std::move(text), offset};
    auto pos = text.find('\n');
    if (pos == std::string::npos) return {std::move(text), offset};
    long long shifted = offset + static_cast<long long>(pos) + 1;
    return {text.substr(pos + 1), shifted};
}
}  // namespace

namespace deploybutton {
Json::Value getStepOutputChunk(const DbClientPtr &db, long long stepRunId,
                               std::optional<long long> before,
                               std::optional<long long> after,
                               long long limit) {
    auto lenRow = db->execSqlSync(
        "SELECT length(output) AS len FROM step_runs WHERE id = ?",
        stepRunId);
    if (lenRow.empty()) return Json::Value();
    const long long total = lenRow[0]["len"].as<long long>();
    if (limit <= 0) limit = 1;

    Json::Value chunk;
    chunk["total_length"] = toJsonInt64(total);

    if (after.has_value()) {
        // Live-tail mode: new content since the caller's last-known end
        // offset. Already a safe boundary, so no snapping needed.
        const long long start = std::clamp(*after, 0LL, total);
        auto result = db->execSqlSync(
            "SELECT substr(output, ?) AS chunk FROM step_runs WHERE id = ?",
            start + 1, stepRunId);
        chunk["text"] = result[0]["chunk"].as<std::string>();
        chunk["start_offset"] = toJsonInt64(start);
        chunk["end_offset"] = toJsonInt64(total);
        return chunk;
    }

    // "before" pages backward from an exclusive end offset; plain tail mode
    // (no params) is the same with the end pinned to the current total.
    const long long endOffset =
        std::clamp(before.has_value() ? *before : total, 0LL, total);
    const long long rawStart = std::max(0LL, endOffset - limit);

    auto result = db->execSqlSync(
        "SELECT substr(output, ?, ?) AS chunk FROM step_runs WHERE id = ?",
        rawStart + 1, endOffset - rawStart, stepRunId);
    auto snapped =
        snapToLineStart(result[0]["chunk"].as<std::string>(), rawStart);

    chunk["text"] = snapped.text;
    chunk["start_offset"] = toJsonInt64(snapped.offset);
    chunk["end_offset"] = toJsonInt64(endOffset);
    return chunk;
}
}  // namespace deploybutton
