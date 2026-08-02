#include <drogon/drogon.h>
#include "db/Schema.h"
#include "db/Seed.h"

int main() {
    drogon::app().loadConfigFile("./config.json");

    drogon::app().registerBeginningAdvice([]() {
        deploybutton::applySchema("./db/schema.sql");
        deploybutton::seedDefaultWorkflows();
    });

    drogon::app().run();
    return 0;
}
