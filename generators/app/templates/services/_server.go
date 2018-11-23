package <%= servicePackage %>

import (
	"context"

	"github.com/gogo/protobuf/types"
	"github.com/opentracing/opentracing-go"
	"github.com/spf13/viper"
	"gitlab.360live.vn/zalopay/go-common/common"
	"gitlab.360live.vn/zalopay/go-common/log"
	"<%= projectPath %>/<%= projectName %>/grpc-gen/<%= servicePackage %>"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

// Server implements <%= servicePackage %> service
type Server struct {
	tracer    opentracing.Tracer
	logger    log.Factory
}

// NewServer creates a new <%= servicePackage %>.<%= serviceName %>
func NewServer(tracer opentracing.Tracer, logger log.Factory) *Server {
	return &Server{
		tracer:    tracer,
		logger:    logger,
	}
}

// Run starts the server
func (s *Server) Run() error {
	server := common.NewGrpcServer(s.registerServer, "/<%= servicePackage %>", s.tracer)
	server.WithLogger(s.logger)
	server.AddShutdownHook(func() {})

	port := viper.GetInt("<%= servicePackage %>.grpc_port")
	s.logger.Bg().Info("Start listen", zap.Int("port", port))
	return server.Run(port)
}

func (s *Server) registerServer(server *grpc.Server) {
	<%= servicePackage %>.Register<%= serviceName %>Server(server, s)
}

// Echo test methods
func (s *Server) Echo(ctx context.Context, req *types.StringValue) (*types.StringValue, error) {
	return &types.StringValue{Value: req.Value}, nil
}
