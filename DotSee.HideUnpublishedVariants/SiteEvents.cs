using System.Configuration;
using System.Linq;
using Umbraco.Core;
using Umbraco.Core.Composing;
using Umbraco.Web;
using Umbraco.Web.Trees;

namespace DotSee.HideUnpublishedVariants
{
    public class SiteEvents : IUserComposer
    {
        public void Compose(Composition composition)
        {
            composition.Components().Append<SubscribeToEvents>();
            //composition.ContentFinders().Append<ContentFinderByUrlAndTemplate>();
        }
    }

    public class SubscribeToEvents : IComponent
    {
        private readonly IUmbracoContextFactory _context;

        public SubscribeToEvents(IUmbracoContextFactory context)
        {
            _context = context;
        }

        public void Initialize()
        {
            TreeControllerBase.MenuRendering += TreeControllerBase_MenuRendering;
        }

        public void Terminate()
        {
        }

        private void TreeControllerBase_MenuRendering(TreeControllerBase sender, MenuRenderingEventArgs e)
        {
            if (sender.TreeAlias == "content" && (ConfigurationManager.AppSettings.Get("HideUnpublishedVariants.Enable") ?? "false") == "true")
            {
                using (var cref = _context.EnsureUmbracoContext())
                {
                    var cache = cref.UmbracoContext.Content;
                    if (string.IsNullOrEmpty(e.NodeId) || e.NodeId == "-1" || e.NodeId.Equals(Constants.System.RecycleBinContentString)) { return; }
                    var node = cache.GetById(contentId: int.Parse(e.NodeId));
                    if (node.Level == 1)
                    {
                        var toggleMenuItem = new Umbraco.Web.Models.Trees.MenuItem("toggleMlNodes", "Toggle not created variants");
                        toggleMenuItem.Icon = "axis-rotation";
                        toggleMenuItem.SeparatorBefore = true;
                        toggleMenuItem.ExecuteJsMethod("HideShowTreeNodes()");
                        e.Menu.Items.Insert(e.Menu.Items.Count(), toggleMenuItem);
                    }
                }
            }
        }
    }
}