cmake_minimum_required(VERSION 3.16)
project(deploybutton_backend CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Drogon CONFIG REQUIRED)
find_package(CURL REQUIRED)

file(GLOB_RECURSE APP_SOURCES CONFIGURE_DEPENDS
    ${CMAKE_CURRENT_SOURCE_DIR}/controllers/*.cc
    ${CMAKE_CURRENT_SOURCE_DIR}/engine/*.cc
    ${CMAKE_CURRENT_SOURCE_DIR}/repositories/*.cc
    ${CMAKE_CURRENT_SOURCE_DIR}/db/*.cc
)

add_executable(deploybutton_backend main.cc ${APP_SOURCES})

target_include_directories(deploybutton_backend PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/controllers
    ${CMAKE_CURRENT_SOURCE_DIR}/engine
    ${CMAKE_CURRENT_SOURCE_DIR}/repositories
    ${CMAKE_CURRENT_SOURCE_DIR}/db
)

target_link_libraries(deploybutton_backend PRIVATE Drogon::Drogon CURL::libcurl)

file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/config.json DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
file(COPY ${CMAKE_CURRENT_SOURCE_DIR}/db/schema.sql DESTINATION ${CMAKE_CURRENT_BINARY_DIR}/db)
