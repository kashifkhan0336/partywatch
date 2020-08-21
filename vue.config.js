const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;
module.exports = {
	devServer: {
		disableHostCheck: true,
		port: 4000,
		public: "0.0.0.0:4000",
	},
	configureWebpack: {
		optimization: {
			runtimeChunk: "single",
			splitChunks: {
				chunks: "all",
				maxInitialRequests: Infinity,
				minSize: 0,
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name(module) {
							const packageName = module.context.match(
								/[\\/]node_modules[\\/](.*?)([\\/]|$)/
							)[1];
							return `npm.${packageName.replace("@", "")}`;
						},
					},
				},
			},
		},
	},
};