# VisuStat
# Version 1.0
# consoleServer.r
#
# Executes

# Clear history and import appropriate packages
rm(list=ls())
library(jsonlite)

# Decode analysis request
input <- POST$terminalInput
#output <- 
output <- eval(parse(text=input))
if (!is.null(names(output))) 
{
	print(output)
} else # } and else must be on same line or R interprer fucks up
{
	output <- serializeJSON(output, digits = 8, pretty=T)
	cat(output)
}
