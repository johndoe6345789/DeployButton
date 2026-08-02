find_package(GTest REQUIRED)

file(GLOB_RECURSE TEST_SOURCES CONFIGURE_DEPENDS
    ${CMAKE_CURRENT_SOURCE_DIR}/*.cc
)

add_executable(deploybutton_tests ${TEST_SOURCES})

target_include_directories(deploybutton_tests PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}
)

target_link_libraries(deploybutton_tests PRIVATE
    deploybutton_lib
    GTest::gtest
    GTest::gmock
)

# The suite reads db/schema.sql relative to its own working directory, same
# convention as the server binary.
file(COPY ${CMAKE_SOURCE_DIR}/db/schema.sql
     DESTINATION ${CMAKE_CURRENT_BINARY_DIR}/db)

add_test(NAME deploybutton_tests COMMAND deploybutton_tests
         WORKING_DIRECTORY ${CMAKE_CURRENT_BINARY_DIR})
