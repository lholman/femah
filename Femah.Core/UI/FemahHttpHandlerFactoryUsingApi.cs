using System.Web;

namespace Femah.Core.UI
{
    public class FemahHttpHandlerFactoryUsingApi : IHttpHandlerFactory
    {
        public IHttpHandler GetHandler(HttpContext context, string requestType, string url, string pathTranslated)
        {
            return new FemahHttpHandlerUsingApi();
        }

        public void ReleaseHandler(IHttpHandler handler)
        {
        }
    }
}
