package integration

import (
	"context"
	"testing"

	"github.com/gogo/protobuf/types"
	"github.com/stretchr/testify/assert"
	"gitlab.360live.vn/zalopay/zpi-pkg/testutils"
	"<%= projectPath %>/<%= projectName %>/grpc-gen/<%= servicePackage %>"
)

func TestEcho(t *testing.T) {
	client := <%= servicePackage %>.New<%= serviceName %>Client(testutils.LocalConn(2636))

	message := "Hello, kesaran"
	echo, err := client.Echo(
		context.Background(),
		&types.StringValue{Value: message},
	)
	assert.Nil(t, err)
	assert.Equal(t, message, echo.Value)
}
