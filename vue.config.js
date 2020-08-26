const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
	.BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	devServer: {
		disableHostCheck: true,
		port: 4000,
		public: "0.0.0.0:4000",
	},
	configureWebpack: {
		plugins: [
			new CompressionPlugin({
				deleteOriginalAssets: true,
				test: /\.js(\?.*)?$/i,
			}),
		],
		optimization: {
			minimize: true,
			minimizer: [new CssMinimizerPlugin({test: /\.foo\.css$/i,})],
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