cmake_minimum_required(VERSION 3.16)
project(deploybutton_backend CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

option(BUILD_TESTING "Build the gtest suite" OFF)
option(ENABLE_COVERAGE "Instrument the build for gcov/gcovr coverage" OFF)

find_package(Drogon CONFIG REQUIRED)
find_package(CURL REQUIRED)

file(GLOB_RECURSE APP_SOURCES CONFIGURE_DEPENDS
    ${CMAKE_CURRENT_SOURCE_DIR}/controllers/*.cc
    ${CMAKE_CURRENT_SOURCE_DIR}/engine/*.cc
    ${CMAKE_CURRENT_SOURCE_DIR}/repositories/*.cc
    ${CMAKE_CURRENT_SOURCE_DIR}/db/*.cc
)

# Everything except main.cc, so the test binary can link the same
# controllers/engine/repositories/db code the server runs. OBJECT (not
# STATIC) so every translation unit is always linked in -- Drogon's
# HttpController subclasses self-register via static initializers, which
# a plain .a archive could silently drop if nothing else references them.
add_library(deploybutton_lib OBJECT ${APP_SOURCES})

target_include_directories(deploybutton_lib PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/controllers
    ${CMAKE_CURRENT_SOURCE_DIR}/engine
    ${CMAKE_CURRENT_SOURCE_DIR}/repositories
    ${CMAKE_CURRENT_SOURCE_DIR}/db
)

target_link_libraries(deploybutton_lib PUBLIC Drogon::Drogon CURL::libcurl)

if(ENABLE_COVERAGE)
    target_compile_options(deploybutton_lib PUBLIC --coverage -O0 -g)
    target_link_options(deploybutton_lib PUBLIC --coverage)
endif()

add_executable(deploybutton_backend main.cc)
target_link_libraries(deploybutton_backend PRIVATE deploybutton_lib)

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/config.json DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/db/schema.sql DESTINATION ${CMAKE_CURRENT_BINARY_DIR}/db)

if(BUILD_TESTING)
    enable_testing()
    add_subdirectory(tests)
endif()
