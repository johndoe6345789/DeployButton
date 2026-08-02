#include <drogon/drogon.h>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include "db/Bootstrap.h"

int main()
{
    drogon::app().loadConfigFile("./config.json");

    drogon::app().registerBeginningAdvice([]() {
        deploybutton::applySchema("./db/schema.sql");
        deploybutton::seedDefaultWorkflows();
    });

    drogon::app().run();
    return 0;
}
