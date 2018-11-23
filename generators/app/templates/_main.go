package main

import "gitlab.360live.vn/zalopay/<%= projectName %>/cmd"

var revision = ""

func main() {
	cmd.SetRevision(revision)
	cmd.Execute()
}
