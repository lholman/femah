function shortenFeatureTypeName(featureType) {
    return featureType.replace("Femah.Core.FeatureSwitchTypes.", "").replace(", Femah.Core, Version=0.1.0.0, Culture=neutral, PublicKeyToken=null", "");
};

Femah.FeatureSwitchType = Backbone.Model.extend({
});

Femah.FeatureSwitchTypeCollection = Backbone.Collection.extend({
    model: Femah.FeatureSwitchType,
    url: '/femah.axd/api/featureswitchtypes'
});

Femah.FeatureSwitchTypeCollection2 = Backbone.Collection.extend({
    model: Femah.FeatureSwitchType,
});

Femah.FeatureSwitch = Backbone.Model.extend({
});

Femah.FeatureSwitchCollection = Backbone.Collection.extend({
    model: Femah.FeatureSwitch,
    url: '/femah.axd/api/featureswitches'
});

Femah.FeatureSwitchTypeView = Backbone.View.extend({
    tagName: "li",
    render: function() {
        var template = $("#featureswitchtypes-list-template").html();
        var compiled = _.template(template, this.model.toJSON());
        $(this.el).html(compiled);
        return this;
    }
});

Femah.FeatureSwitchTypesView = Backbone.View.extend({
    initialize: function () {
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", this.render, this);
        this.collection.bind("remove", this.render, this);
 
    },
    tagName: "ul",
    render: function () {
        var els = [];
        this.collection.each(function (item) {
            var itemView = new Femah.FeatureSwitchTypeView({ model: item });
            els.push(itemView.render().el);
        });
        //return this;
        $(this.el).html(els);
        $("#featureswitchtypes-list").html(this.el);
    }
});

Femah.FeatureSwitchView = Backbone.View.extend({
    initialize: function(options) {
        this.options = options || {};
    },
    tagName: "tr",

    render: function () {
        //console.log("FeatureSwitchView render called");
        this.featureTypesList = this.options.featureTypesList;

        this.template = $("#featureswitches-list-template").html();
        var compiled = _.template(this.template);
        this.$el.html(compiled({ model: this.model.toJSON(), featureTypes: this.featureTypesList }));
        return this;
    }
});

Femah.FeatureSwitchesView = Backbone.View.extend({
    initialize: function() {
        this.collection.bind("reset", this.render, this);
        this.collection.bind("add", this.render, this);
        this.collection.bind("remove", this.render, this);

    },
    tagName: "table",
    render: function () {
        var els = [];
        //var featureTypesList = ["Simple", "Percentage", "Other"];
        var featureTypesList = Femah.featureSwitchTypes.toJSON();
        this.collection.each(function (item) {
            var itemView = new Femah.FeatureSwitchView({ model: item, featureTypesList: featureTypesList });
            els.push(itemView.render().el);
        });
        //return this;
        $(this.el).html(els);
        $("#featureswitches-list").html(this.el);
    }
});