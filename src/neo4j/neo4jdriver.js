const neo4j = require('neo4j-driver').v1

let driver

driver = neo4j.driver("bolt://hobby-fhkckikncggcgbkefnnaffbl.dbs.graphenedb.com:24786"), neo4j.auth.basic('studdit', "b.zHGALeNcZatb.R8CRywEG0lgq6pSh")

module.exports = driver