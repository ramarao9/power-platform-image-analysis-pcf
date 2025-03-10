using ImageAnalysis.Services;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;
using System.IO;


namespace ImageAnalysis.Tests.Services
{

    [TestClass]
    public class ImageAnalysisServiceTests
    {


        ServiceClient _serviceClient;

        private IOrganizationService _organizationService;

        [TestInitialize]
        public void Initialize()
        {
            string clientId = Environment.GetEnvironmentVariable("DATAVERSE_CLIENT_ID");
            string clientSecret = Environment.GetEnvironmentVariable("DATAVERSE_CLIENT_SECRET");
            string url = Environment.GetEnvironmentVariable("DATAVERSE_URL");

            if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret) || string.IsNullOrEmpty(url))
            {
                throw new InvalidOperationException("Environment variables for Dataverse connection are not set.");
            }

            string connectionString = $@"
                AuthType=ClientSecret;
                ClientId={clientId};
                ClientSecret={clientSecret};
                Url={url}";

            ServiceClient serviceClient = new ServiceClient(connectionString);
            _serviceClient = serviceClient;
        }




        [TestMethod]
        public void TestAnalyzeImage()
        {


            ImageAnalysisService imageAnalysisService = new ImageAnalysisService();


            string imagePath = "../../TestFiles/Note.jpg";
            byte[] imageBytes = File.ReadAllBytes(imagePath);
            string imageData = Convert.ToBase64String(imageBytes);



            imageAnalysisService.AnalyzeImage(_serviceClient, imageData);


            Assert.IsTrue(true);

        }

    }
}
