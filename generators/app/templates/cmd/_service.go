package cmd

import (
	"github.com/spf13/cobra"
	"gitlab.360live.vn/zalopay/go-common/log"
	"gitlab.360live.vn/zalopay/go-common/tracing"
	"<%= projectPath %>/<%= projectName %>/services/<%= servicePackage %>"
	"gitlab.360live.vn/zalopay/zpi-pkg/utils"
)

var <%= servicePackage %>Cmd = &cobra.Command{
	Use:   "<%= servicePackage %>",
	Short: "Starts <%= servicePackage %> <%= serviceName %>",
	Long:  `Starts <%= servicePackage %> <%= serviceName %>.`,
	RunE: func(cmd *cobra.Command, args []string) error {
		logger := log.NewStandardFactory("/data/logs/<%= projectName %>", "<%= servicePackage %>")

		server := <%= servicePackage %>.NewServer(
			tracing.Init("<%= servicePackage %>.<%= serviceName %>", logger),
			logger,
		)
		return server.Run()
	},
}

var <%= servicePackage %>StopCmd = &cobra.Command{
	Use:   "stop",
	Short: "Stop <%= servicePackage %> <%= serviceName %>",
	RunE: func(cmd *cobra.Command, args []string) error {
		return utils.KillProcess("<%= projectName %> <%= servicePackage %>")
	},
}

func init() {
	RootCmd.AddCommand(<%= servicePackage %>Cmd)
	<%= servicePackage %>Cmd.AddCommand(<%= servicePackage %>StopCmd)
}
