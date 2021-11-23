import Component from "@ember/component";
import I18n from "I18n";
import discourseComputed from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { default as getURL } from "discourse-common/lib/get-url";
import cookie from "discourse/lib/cookie";
import { withPluginApi } from "discourse/lib/plugin-api";


export default Component.extend({
  tagName: "",
  hidden: false,
  bannerTitle: "Default text",
  init() {
    this._super(...arguments);
    this.appEvents.on("cta:shown", this, this._triggerBanner);

    withPluginApi("0.8.8", (api) => {
      debugger;
      const currentUser = api.getCurrentUser();
      //let bannerTitleText = { innerHTML: settings.main_heading_content };
      let bannerTitleText = "Welcome, {First_name} are you up for a challenge ->";
      if (currentUser && bannerTitleText) {

        api.container.lookup('store:main').find('user', currentUser.username).then((user) => {
          let currentUserObj = user;
          let userFieldsObj = this.site.get("user_fields");
          if (currentUserObj && currentUserObj.username) {
            var userFieldValues = currentUserObj.user_fields;
            let firstnameFieldObj = userFieldsObj.find(obj => obj.name.toLowerCase() == ("First name").toLowerCase());
            var currentuserFirstName = "";
            if (firstnameFieldObj) { currentuserFirstName = userFieldValues[firstnameFieldObj.id] }

            if (currentuserFirstName) {
              bannerTitleText = bannerTitleText.replace('{First_name}', currentuserFirstName);
              //result = h('div.section-header', bannerTitleText);
              this.set("bannerTitle", bannerTitleText);
              this.appEvents.trigger("banner-button-container-widget:refresh");
            }
          }
        });


      }

    });
  },

  willDestroyElement() {
    this.appEvents.off("cta:shown", this, this._triggerBanner);
  },

  _triggerBanner() {
    this.set("hidden", false)
  },

  @discourseComputed("hidden")
shouldShow(hidden) {
  return !hidden;
},



@action
dismissBanner() {
  this.keyValueStore.setItem("anon-cta-never", "t");
  this.session.set("showSignupCta", false);
  this.set("hidden", true);
},

@action
showBannerLater() {
  this.keyValueStore.setItem("anon-cta-hidden", Date.now());
  this.set("hidden", true)
},
});
