using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Web;
using System.Web.UI;

namespace Femah.Core.UI
{
    internal sealed class FemahHttpHandlerUsingApi : IHttpHandler
    {
        private const string _enableFeatureAction = "enablefeature";
        private const string _setSwitchTypeAction = "setswitchtype";
        private const string _setCustomAttributesAction = "setcustomattributes";

        public void ProcessRequest(HttpContext context)
        {
            if (context.Request.Path.Contains("assets/"))
            {
                //Render static embedded files
                context.Response.ContentType = "text/javascript";
                StreamReader streamReader;

                try
                {
                    Assembly assembly = Assembly.GetExecutingAssembly();
                    var relativeResourceLocation = context.Request.Path.Replace("/femah.axd", "").Replace("/", ".");
                    var fullResourceLocation = string.Format("{0}{1}", "Femah.Core.UI", relativeResourceLocation);
                    streamReader = new StreamReader(assembly.GetManifestResourceStream(fullResourceLocation));
                }
                catch (Exception)
                {
                    return;
                }

                var textAsset = streamReader.ReadToEnd();
                context.Response.Write(textAsset);
                return;
            }

            var action = context.Request.QueryString["action"];
            if (action != null)
            {
                string name;
                switch (action)
                {
//                    case _enableFeatureAction:
//                        name = context.Request.QueryString["name"];
//                        var enabled = context.Request.QueryString["enabled"];
//                        bool doEnable;
//                        if (name != null && enabled != null && Boolean.TryParse(enabled, out doEnable))
//                        {
//                            Femah.EnableFeature(name, doEnable);
//                        }
//                        break;

                    case _setSwitchTypeAction:
                        name = context.Request.QueryString["name"];
                        var switchType = context.Request.QueryString["switchtype"];
                        if (name != null && switchType != null)
                        {
                            Femah.SetSwitchType(name, switchType);
                        }
                        break;

                    case _setCustomAttributesAction:
                        name = context.Request.QueryString["name"];
                        var queryString = context.Request.QueryString;

                        var customAttributes = new Dictionary<string, string>();
                        //Convert the NameValueCollection to Dictionary<string, string> as we get type safety and equality comparing with a Dictionary
                        foreach (var key in queryString.AllKeys)
                        {
                            if (!customAttributes.ContainsKey(key))
                                customAttributes.Add(key, queryString[key]);
                        }
                        Femah.SetFeatureAttributes(name, customAttributes);
                        break;
                }

                context.Response.Redirect(context.Request.Url.AbsolutePath);
                return;
            }


            var stringWriter = new StringWriter();
            var htmlTextWriter = context.Request.Browser.CreateHtmlTextWriter(stringWriter);

            RenderPage(htmlTextWriter);

            context.Response.Write(stringWriter.ToString());
        }

        public bool IsReusable
        {
            get { return true; }
        }

        /// <summary>
        /// Render the HTML for the admin page to the response.
        /// </summary>
        /// <param name="response">The <see cref="HttpResponse"/> to render the page to.</param>
        private void RenderPage(HtmlTextWriter writer)
        {
            writer.BeginRender();
            writer.RenderBeginTag(HtmlTextWriterTag.Html);

            // Write HTML header.
            writer.RenderBeginTag(HtmlTextWriterTag.Head);
            writer.RenderBeginTag(HtmlTextWriterTag.Title);
            writer.Write("FEMAH");
            writer.RenderEndTag( /* Title */ );
            writer.RenderEndTag( /* Head */ );

            // Write page header.
            writer.RenderBeginTag(HtmlTextWriterTag.Body);
            writer.AddAttribute(HtmlTextWriterAttribute.Id, "featureswitches-app");
            writer.RenderBeginTag(HtmlTextWriterTag.Div);
                writer.RenderBeginTag(HtmlTextWriterTag.H1);
                    writer.Write("FEMAH");
                writer.RenderEndTag(/* H1 */);

                writer.AddAttribute(HtmlTextWriterAttribute.Id, "main");
                writer.RenderBeginTag("section");
                    writer.AddAttribute(HtmlTextWriterAttribute.Id, "featureswitches-list");
                    writer.RenderBeginTag(HtmlTextWriterTag.Table);
                    writer.RenderEndTag(/* Table */);
                writer.RenderEndTag(/* section - main */);
                
            writer.RenderEndTag(/* Div - featureswitches-app */);
            // Render all feature switches.
            var features = Femah.AllFeatures();
            if (features.Count == 0)
            {
                writer.RenderBeginTag(HtmlTextWriterTag.P);
                writer.Write("There are no feature switches.");
                writer.RenderEndTag(/* P */);
            }
            else
            {
                
                
                
                writer.Write("<script type=\"text/html\" id=\"featureswitches-list-template\">");
                
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write("<%= model.Name %>");
                    writer.RenderEndTag(/* Td */);
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write("<%= shortenFeatureTypeName(model.FeatureType) %>");

                        writer.AddAttribute("action", "/femah.axd");
                        writer.RenderBeginTag(HtmlTextWriterTag.Form);
                            writer.Write("<input type='hidden' name='action' value='{0}'></input>", _setSwitchTypeAction);
                            writer.Write("<input type='hidden' name='name' value='{0}'></input>", "<%= model.Name %>");

                            writer.AddAttribute(HtmlTextWriterAttribute.Id, "featureswitchtypes");
                            writer.AddAttribute(HtmlTextWriterAttribute.Name, "switchtype");
                                writer.RenderBeginTag(HtmlTextWriterTag.Select);
                                    writer.Write("<% _.each(featureTypes, function (item) { %>");
                                        writer.RenderBeginTag(HtmlTextWriterTag.Option);
                                        writer.Write("<%= item.Name %>");
                                        writer.RenderEndTag(/* Option */);
                                    writer.Write("<% }); %>");
                                writer.RenderEndTag(/* Select */);
                            writer.Write("<input type='submit' value='Change'></input>");
                        writer.RenderEndTag(/* Form */);
                    writer.RenderEndTag(/* Td */);    

                    // Enabled or disabled."
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.Write("<%= model.IsEnabled ? 'Enabled' : 'Disabled' %>");
                        writer.AddAttribute("action", "/femah.axd");
                        writer.RenderBeginTag(HtmlTextWriterTag.Form);
                            writer.Write("<input type='hidden' name='action' value='{0}'></input>", _enableFeatureAction);
                            writer.Write("<input type='hidden' name='name' value='{0}'></input>", "<%= model.Name %>");
                            writer.Write("<input type='hidden' id='featureswitch-status-enabled' name='featureswitch-status-enabled' value='{0}'></input>", "<%= !model.IsEnabled %>");
                            //writer.Write("<% debugger; %>");
                            //writer.Write("<input type='hidden' id='updated-model' name='model' value='{0}'></input>", "<%= JSON.stringify(model) %>");
                            writer.Write("<input type='submit' value='{0}'></input>", "<%= model.IsEnabled ? 'Disable' : 'Enable' %>");
                        writer.RenderEndTag(/* Form */);
                    writer.RenderEndTag(/* Td */);

                    // Enabled or disabled. TAKE 2"
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.AddAttribute("class", "toggle");
                        writer.AddAttribute("type", "checkbox");
                        //writer.AddAttribute("<%= model.IsEnabled ? 'checked='checked'' : '' %>", "");
                        writer.RenderBeginTag(HtmlTextWriterTag.Input);
                        writer.RenderEndTag(/* Input */);
                    writer.RenderEndTag(/* Td */);

                    // Custom attributes.
                    writer.RenderBeginTag(HtmlTextWriterTag.Td);
                        writer.RenderBeginTag(HtmlTextWriterTag.Form);
                            writer.Write("<input type='hidden' name='name' value='{0}'></input>", "<%= model.Name %>");
                            writer.Write("<input type='hidden' name='action' value='{0}'></input>", _setCustomAttributesAction);
                            //feature.RenderUi(writer);
                            //TODO: How do we do this, look up feature switch by name maybe?
                        writer.RenderEndTag(/* Form*/);
                    writer.RenderEndTag(/* Td */);
                writer.Write("</script>");
                
            }

            

            //Note, a wonderful convention of escaping numbers with an underscore is required in Manifest Resource names (i.e. embedded 
            //resources) retrieved in this way, we could pass this dynamically but I figure it's better to keep it obvious in the script references.
            writer.Write("<script src=\"femah.axd/assets/libs/jquery/_1._7._2/jquery-min.js\" type=\"text/javascript\"></script>");
//            writer.Write("<script src=\"femah.axd/assets/libs/jquery/_1._11._0/jquery-min.js\" type=\"text/javascript\"></script>");
            writer.Write("<script src=\"femah.axd/assets/libs/underscore.js/_1._6._0/underscore-min.js\" type=\"text/javascript\"></script>");
            writer.Write("<script src=\"femah.axd/assets/libs/backbone.js/_1._1._2/backbone-min.js\" type=\"text/javascript\"></script>");

//            writer.Write("<script src=\"femah.axd/assets/libs/jquery/_1._7._2/jquery-min.js\" type=\"text/javascript\"></script>");
//            writer.Write("<script src=\"femah.axd/assets/libs/underscore.js/_1._3._3/underscore-min.js\" type=\"text/javascript\"></script>");
//            writer.Write("<script src=\"femah.axd/assets/libs/backbone.js/_0._9._2/backbone-min.js\" type=\"text/javascript\"></script>");

            writer.Write("<script src=\"femah.axd/assets/app/app.js\" type=\"text/javascript\"></script>");
            writer.Write("<script src=\"femah.axd/assets/app/features.js\" type=\"text/javascript\"></script>");
            writer.Write("<script type=\"text/javascript\">$(function(){Femah.init();})</script>");
            writer.RenderEndTag(/* Body */);
            writer.RenderEndTag(/* Html */);
            writer.EndRender();
        }

    }
}
