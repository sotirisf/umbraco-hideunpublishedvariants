using System.Configuration;
using System.Web.Http;

namespace DotSee.HideUnpublishedVariants
{
    public class TreeVariantSettingsController : Umbraco.Web.WebApi.UmbracoApiController
    {
        [HttpGet]
        public string HideUnpublishedVariantsEnable()
        {
            var retVal = ConfigurationManager.AppSettings.Get("HideUnpublishedVariants.Enable") ?? "false";
            return (retVal.ToLower()); ;
        }
        [HttpGet]
        public string HideUnpublishedVariantsDefault()
        {
            var retVal = ConfigurationManager.AppSettings.Get("HideUnpublishedVariants.Default") ?? "show";
            return (retVal.ToLower()); ;
        }

    }
}