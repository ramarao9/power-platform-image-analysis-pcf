using ImageAnalysis.Services;
using Microsoft.Xrm.Sdk;
using System;


namespace RRK.Plugins.ImageAnalysis
{
    public class AnalyzeImage : PluginBase
    {

        public AnalyzeImage(string unsecureConfiguration, string secureConfiguration)
    : base(typeof(AnalyzeImage))
        {

        }

        // Entry point for custom business logic execution
        protected override void ExecuteDataversePlugin(ILocalPluginContext localPluginContext)
        {
            if (localPluginContext == null)
            {
                throw new ArgumentNullException(nameof(localPluginContext));
            }

            var context = localPluginContext.PluginExecutionContext;
            if (context.MessageName.Equals("ExtractTextBlocksFromImage") && context.Stage.Equals(30))
                return;

            var tracingService = localPluginContext.TracingService;

            try
            {

                string imageData = context.InputParameters.Contains("ImageData") ? Convert.ToString(context.InputParameters["ImageData"]) : string.Empty;
                IOrganizationService organizationService = localPluginContext.OrgSvcFactory.CreateOrganizationService(context.UserId);


                ImageAnalysisService imageAnalysisService = new ImageAnalysisService();
                string textBlocksJSON = imageAnalysisService.AnalyzeImage(organizationService, imageData);


                if (!string.IsNullOrEmpty(textBlocksJSON))
                {
                    //Simply reversing the characters of the string
                    context.OutputParameters["TextBlocksJSON"] = textBlocksJSON;
                }
            }
            catch (Exception ex)
            {
                tracingService.Trace("ExtractTextBlocksFromImage: {0}", ex.ToString());
                throw new InvalidPluginExecutionException("An error occurred in ExtractTextBlocksFromImage.", ex);
            }
        }
    }
}

