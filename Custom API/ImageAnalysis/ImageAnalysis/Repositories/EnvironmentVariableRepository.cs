using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;


namespace ImageAnalysis.Repositories
{
    internal class EnvironmentVariableRepository
    {
        private readonly IOrganizationService _service;

        public EnvironmentVariableRepository(IOrganizationService service)
        {
            _service = service;
        }

        public string GetEnvironmentVariableValue(string schemaName)
        {

            QueryExpression queryExpression = new QueryExpression("environmentvariablevalue")
            {
                ColumnSet = new ColumnSet("value"),
                Criteria = new FilterExpression()
                {
                    Conditions =
                    {
                        new ConditionExpression("statecode", ConditionOperator.Equal, 0)
                    }
                }
            };

            LinkEntity environmentVariableDefintionLE = new LinkEntity("environmentvariabledefinition", "environmentvariablevalue", "environmentvariabledefinitionid", "environmentvariabledefinitionid", JoinOperator.Inner);
            environmentVariableDefintionLE.LinkCriteria.AddCondition("schemaname", ConditionOperator.Equal, schemaName);


            queryExpression.LinkEntities.Add(environmentVariableDefintionLE);

            EntityCollection results = _service.RetrieveMultiple(queryExpression);

            if (results.Entities.Count > 0)
            {
                return results.Entities[0].GetAttributeValue<string>("value");
            }

            return null;
        }
    }
}
