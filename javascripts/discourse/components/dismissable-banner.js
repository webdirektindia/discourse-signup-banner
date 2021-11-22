import Component from "@ember/component";
import I18n from "I18n";
import discourseComputed from "discourse-common/utils/decorators";
import { action } from "@ember/object";
import { default as getURL } from "discourse-common/lib/get-url";
import cookie from "discourse/lib/cookie";

export default Component.extend({
  tagName: "",
  hidden: true,

  init() {
    this._super(...arguments);
    this.appEvents.on("cta:shown", this, this._triggerBanner);
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

  @action
  triggerCta() {
    this.appEvents.trigger("cta:shown");
  }
});
