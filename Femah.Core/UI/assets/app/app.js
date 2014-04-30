Femah ={

    init: function () {

        //data
        Femah.featureSwitchTypes = new Femah.FeatureSwitchTypeCollection();
        Femah.featureSwitches = new Femah.FeatureSwitchCollection();

        //views
        //Femah.featureSwitchTypeList = new Femah.FeatureSwitchTypesView({ collection: Femah.featureSwitchTypes });
        Femah.featureSwitchList = new Femah.FeatureSwitchesView({ collection: Femah.featureSwitches });

        Femah.start();
    },
    start: function () {

        Femah.featureSwitchTypes.fetch();
        Femah.featureSwitches.fetch();

    }
}







