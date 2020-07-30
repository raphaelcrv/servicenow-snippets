//1. create a excel file with all colunms translated
//2. convert to json http://beautifytools.com/excel-to-json-converter.php
//3. 


var table = 'u_kpi_report';
var language = 'en'; //[en,pb,es]

var toTranslate =
[{
    "english": "KPI Number",
    "element": "kpi_u_number"
},
{
    "english": "KPI Description",
    "element": "u_kpi"
},
{
    "english": "KPI Classification",
    "element": "kpi_u_classification"
},
{
    "english": "KPI Calculation Rule",
    "element": "kpi_u_calculation_rules"
},
{
    "english": "KPI ICO(%) ",
    "element": "kpi_u_ico"
},
{
    "english": "Total Planned KPI",
    "element": "kpi_u_total_planned"
},
{
    "english": "Total Fulfilled KPI",
    "element": "kpi_u_total_fulfilled"
},
{
    "english": "KR Number",
    "element": "kr_u_number"
},
{
    "english": "KR Description",
    "element": "okr_short_description"
},
{
    "english": "OKR Number",
    "element": "okr_u_number"
},
{
    "english": "OKR Description",
    "element": "okr_short_description"
},
{
    "english": "Grow Number",
    "element": "grow_number"
},
{
    "english": "Grow Name",
    "element": "grow_short_description"
},
{
    "english": "Grow Description",
    "element": "grow_description"
},
{
    "english": "Grow Start Date",
    "element": "grow_u_start_date"
},
{
    "english": "Grow End Date",
    "element": "grow_u_end_date"
},
{
    "english": "Business Portifolio Number",
    "element": "businessportifolio_number"
},
{
    "english": "Business Portifolio Description",
    "element": "businessportifolio_description"
},
{
    "english": "Business Portifolio Director",
    "element": "businessportifolio_u_executive_area"
},
{
    "english": "Business Portifolio Director Board",
    "element": "businessportifolio_u_executive_area_head"
},
{
    "english": "Business Portifolio Superintendent",
    "element": "businessportifolio_u_business_superintendent"
},
{
    "english": "Business Portifolio Manager ",
    "element": "businessportifolio_u_portfolio_business_manager"
},
{
    "english": "Initiative Number",
    "element": "initiative_number"
},
{
    "english": "Initiative Title",
    "element": "initiative_short_description"
},
{
    "english": "Initiative Description",
    "element": "initiative_description"
},
{
    "english": "Epic Number",
    "element": "epic_number"
},
{
    "english": "Epic Description",
    "element": "epic_short_description"
},
{
    "english": "Feature Number",
    "element": "feature_number"
},
{
    "english": "Feature Name",
    "element": "feature_short_description"
},
{
    "english": "Feature Description",
    "element": "feature_description"
},
{
    "english": "Feature Classification",
    "element": "feature_u_classification"
},
{
    "english": "Grouping Code",
    "element": "feature_u_grouping_code"
},
{
    "english": "Grouping End Date",
    "element": "featuregrouping_u_grouping_end_date"
},
{
    "english": "Grouping Codes",
    "element": "feature_u_groupings_codes"
}
];


//create a translation for every colum in array element
toTranslate.forEach(function(el){
  
    var grLabel = new GlideRecord('sys_documentation');
    grLabel.initialize();
    grLabel.element = el.element;
    grLabel.label = el.english;
    grLabel.language = language;
    grLabel.table = table;
    gs.info(grLabel.insert());


})