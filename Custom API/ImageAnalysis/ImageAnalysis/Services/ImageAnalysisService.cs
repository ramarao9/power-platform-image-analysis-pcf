using Azure.AI.Vision.ImageAnalysis;
using Azure;
using System;
using ImageAnalysis.Repositories;
using Microsoft.Xrm.Sdk;
using ImageAnalysis.Models;
using System.Text.Json;


namespace ImageAnalysis.Services
{
    public class ImageAnalysisService
    {


        public string AnalyzeImage(IOrganizationService organizationService, string imageData)
        {

            AzureVisionConfig azureVisionConfig = GetAzureVisionConfig(organizationService);

            // Authenticate Azure AI Vision client
            ImageAnalysisClient client = new ImageAnalysisClient(
                new Uri(azureVisionConfig.Endpoint),
                new AzureKeyCredential(azureVisionConfig.Key));

            byte[] imageBytes = Convert.FromBase64String(imageData);


            // Use Analyze image function to read text in image
            ImageAnalysisResult result = client.Analyze(
                BinaryData.FromBytes(imageBytes),
                // Specify the features to be retrieved
                VisualFeatures.Read);

            string textBlocksJSON = JsonSerializer.Serialize(result.Read.Blocks);
            return textBlocksJSON;
        }







        private AzureVisionConfig GetAzureVisionConfig(IOrganizationService organizationService)
        {
            EnvironmentVariableRepository evvRepository = new EnvironmentVariableRepository(organizationService);
            string configJson = evvRepository.GetEnvironmentVariableValue("rrk_AzureVisionConfig");


            AzureVisionConfig azureVisionConfig = JsonSerializer.Deserialize<AzureVisionConfig>(configJson);
            return azureVisionConfig;
        }


    }
}
