'use strict';

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
	
	var dashboardDataSources = {};
	var selectedDataSource = {};
	
	var s_work_sheet_name = "";
	
	$(window).resize(function() {
		$("#div_body").css("width", "100%");
		//$("#div_results_container").css("width", "100%");
		//$("#div_flow").css("width", "100%");
		//$("#div_flow_content").css("width", "100%");
		
		assignAbsolutes();
		callRunTree();
		
		
	});
	
	// Use the jQuery document ready signal to know when everything has been initialized
	$(document).ready(function () {
		
		/*
		$('#choose_visualization_dialog').modal('toggle');
		$("#b_visualization").click(function() {
			chooseVisualization();
		});
		
		$("#b_datasource").click(function() {
			chooseDataSource();
		});
		$("#b_datasource_back").click(function() {
			chooseVisualizationBack();
		});
		*/
		
		// SANKEY ONLY
		$('#choose_worksheet_dialog').modal('toggle');
		$("#b_worksheet").click(function() {
			chooseWorkSheet();
		});
		$("#b_worksheet_back").click(function() {
			chooseVisualizationBack();
		});
		$("#b_fields").click(function() {
			buildVisualization();
		});
		$("#b_fields_back").click(function() {
			chooseWorkSheetBack();
		});

		
		assignAbsolutes();
		//callRunTree();
		
		// Tell Tableau we'd like to initialize our extension
		tableau.extensions.initializeAsync().then(function () {
			
			showChooseSheetDialog()
			
			//// Since dataSource info is attached to the worksheet, we will perform
			//// one async call per worksheet to get every dataSource used in this
			//// dashboard.  This demonstrates the use of Promise.all to combine
			//// promises together and wait for each of them to resolve.
			//let dataSourceFetchPromises = [];
            //
			//// Maps dataSource id to dataSource so we can keep track of unique dataSources.
			////let dashboardDataSources = {};
            //
			//// To get dataSource info, first get the dashboard.
			//const dashboard = tableau.extensions.dashboardContent.dashboard;
            //
			//// Then loop through each worksheet and get its dataSources, save promise for later.
			////alert(dashboard.worksheets.name);
			////alert('hi');
			//dashboard.worksheets.forEach(function (worksheet) {
			//	dataSourceFetchPromises.push(worksheet.getDataSourcesAsync());
			//});
            //
			//Promise.all(dataSourceFetchPromises).then(function (fetchResults) {
			//	fetchResults.forEach(function (dataSourcesForWorksheet) {
			//		dataSourcesForWorksheet.forEach(function (dataSource) {
			//			//alert(dataSource.name);
			//			//loadDataSource(dataSource);
			//			if (!dashboardDataSources[dataSource.id]) { // We've already seen it, skip it.
			//				dashboardDataSources[dataSource.id] = dataSource;
			//				//alert(dataSource.id);
			//				$("#no_data_message").html(dataSource.id);
			//			}
			//		});
			//  
			//		showChooseDataSourceDialog();
			//  
			//	});
			//
			//});
		    //
			////initializeButtons();
			
		}, function (err) {
			// Something went wrong in initialization.
			alert('error');
			console.log('Error while Initializing: ' + err.toString());
		});
	    
		// select2
		$(".select_normal").select2({
			dropdownAutoWidth: true,
			dropdownCssClass: "select2class",
			containerCssClass: "select2class"
		});
			
	});

	function chooseVisualization() {
		$('#choose_visualization_dialog').modal('toggle');
		//$('#choose_datasource_dialog').modal('toggle');
		$('#choose_worksheet_dialog').modal('toggle');
	}
	
	function chooseVisualizationBack() {
		//$('#choose_datasource_dialog').modal('toggle');
		$('#choose_worksheet_dialog').modal('toggle');
		$('#choose_visualization_dialog').modal('toggle');
	}
	
	//function chooseDataSource() {
	//	$('#choose_datasource_dialog').modal('toggle');
	//	$('#choose_fields_dialog').modal('toggle');
	//	var dataSourceId = $("#s_data_sources").val();
	//	selectedDataSource = dashboardDataSources[dataSourceId];
	//	//alert(JSON.stringify(dataSource, getCircularReplacer()));
	//	//$("#div_test").html(JSON.stringify(dataSource._dataSourceImpl._dataSourceInfo.fields, getCircularReplacer()));
	//	//$("#div_test").html(JSON.stringify(dataSource._dataSourceImpl._dataSourceInfo.fields));
	//	populateDataFields();
	//}
	//
	//function chooseDataSourceBack() {
	//	$('#choose_fields_dialog').modal('toggle');
	//	$('#choose_datasource_dialog').modal('toggle');
	//}
	
	function chooseWorkSheet() {
		$('#choose_worksheet_dialog').modal('toggle');
		$('#choose_fields_dialog').modal('toggle');
		s_work_sheet_name = $("#s_work_sheets").val();
		//selectedWorkSheet = dashboardWorkSheets[workSheetId];
		//alert(JSON.stringify(dataSource, getCircularReplacer()));
		//$("#div_test").html(JSON.stringify(dataSource._dataSourceImpl._dataSourceInfo.fields, getCircularReplacer()));
		//$("#div_test").html(JSON.stringify(dataSource._dataSourceImpl._dataSourceInfo.fields));
		//alert(s_work_sheet_name);
		populateDataFields();
	}
	
	function chooseWorkSheetBack() {
		$('#choose_fields_dialog').modal('toggle');
		$('#choose_worksheet_dialog').modal('toggle');
	}
	
	function buildVisualization() {
		$('#choose_fields_dialog').modal('toggle');
		$('#div_top_logo').css("display", "");
		loadDataSource();
		//loadSelectedMarks(s_work_sheet_name);
		//$('#choose_datasource_dialog').modal('toggle');
	}
	
	function showChooseDataSourceDialog () {
		
		// Clear out the existing list of sheets
		//$('#choose_datasource_buttons').empty();
    
		// Set the dashboard's name in the title
		//const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
		//$('#choose_sheet_title').text(dashboardName);
    
		// The first step in choosing a sheet will be asking Tableau what sheets are available
		//const datasources = tableau.extensions.dashboardContent.dashboard.datasources;
		//alert(JSON.stringify(datasources));
	
		// Next, we loop through all of these worksheets and add buttons for each one
		
		var s_options = "";
		for (let dataSourceId in dashboardDataSources) {
    
			const dataSource = dashboardDataSources[dataSourceId];
		
			//// Declare our new button which contains the sheet name
			//const button = createButton(dataSource.name);
	        //
			//// Create an event handler for when this button is clicked
			//button.click(function () {
		    //
			//	//alert(dataSource);
			//	//alert(JSON.stringify(dataSource, getCircularReplacer()));
			//	//alert(JSON.stringify(dataSources[dataSourceId]));
			//	//alert(JSON.stringify(Promise.all([dataSource.getUnderlyingDataAsync()]), getCircularReplacer()));
			//	loadDataSource(dataSource);
			//	//dataSource.getUnderlyingDataAsync().then(dataTable => {
			//	//	for (let row of dataTable.data) {
			//	//		alert(row[0].value);
			//	//	}
			//	//});
			//	
			//	//// Get the worksheet name which was selected
			//	//const worksheetName = worksheet.name;
            //
			//	//// Close the dialog and show the data table for this worksheet
			//	//$('#choose_sheet_dialog').modal('toggle');
            //
			//});
		    //
			////// Add our button to the list of worksheets to choose from
			//$('#choose_datasource_buttons').append(button);
			
			s_options += "<option value=\"" + dataSourceId + "\">" + dataSource.name + "</option>";
		
		}
    
		$("#s_data_sources").html(s_options);
		
		// Show the dialog
		//$('#choose_datasource_dialog').modal('toggle');
	}
	
	
	function showChooseSheetDialog () {
		
		// Clear out the existing list of sheets
		//$('#choose_sheet_buttons').empty();

		// Set the dashboard's name in the title
		//const dashboardName = tableau.extensions.dashboardContent.dashboard.name;
		//$('#choose_sheet_title').text(dashboardName);

		// The first step in choosing a sheet will be asking Tableau what sheets are available
		const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;

		// Next, we loop through all of these worksheets add add buttons for each one
		var s_options = "";
		worksheets.forEach(function (worksheet) {
			//// Declare our new button which contains the sheet name
			//const button = createButton(worksheet.name);
            //
			//// Create an event handler for when this button is clicked
			//button.click(function () {
			//	// Get the worksheet name which was selected
			//	const worksheetName = worksheet.name;
            //
			//	// Close the dialog and show the data table for this worksheet
			//	$('#choose_sheet_dialog').modal('toggle');
			//	loadSelectedMarks(worksheetName);
			//});
            //
			//// Add our button to the list of worksheets to choose from
			//$('#choose_sheet_buttons').append(button);
			
			s_options += "<option value=\"" + worksheet.name + "\">" + worksheet.name + "</option>";
			
		});
		
		$("#s_work_sheets").html(s_options);

		// Show the dialog
		//$('#choose_sheet_dialog').modal('toggle');
	}
	
	function populateDataFields () {
		
		//alert(dataSource);
		var s_data = "<option value=\"\">-- Select a Field --</option>";
		//(selectedDataSource.getUnderlyingDataAsync()).then(function (dataTable) {
		tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === s_work_sheet_name).getUnderlyingDataAsync().then(function (dataTable) {
			//alert(JSON.stringify(dataTable.columns));
			var s_fields = "";
			for (let column of dataTable.columns) {
				//alert(JSON.stringify(column));
				//alert(column._fieldName);
				s_data += "<option value=\"" + column._index + "\">" + column._fieldName + "</option>";
				//s_data += "<option value=\"" + column._fieldName + "\">" + column._fieldName + "</option>";
			}
			//$("#div_test").html(s_data);
			$("#s_path_fields").html(s_data);
			$("#s_count_fields").html(s_data);
			//for (let row of dataTable.data) {
			//	alert(row[0].value);
			//}
			//var data = t.getData();
			//var columns = t.getColumns();
			//alert(columns);
		});
		
		// select2
		$(".select_normal").select2("destroy");
		$(".select_normal").select2({
			dropdownAutoWidth: true,
			dropdownCssClass: "select2class",
			containerCssClass: "select2class"
		});
	}
	
	var i_set_event_listeners = 0;
	function loadDataSource () {
		
		
		//alert(dataSource);
		//alert($("#s_path_fields").val());
		//var s_data = "{\"results\": [{ \"data\": [{ \"path\": \"[ACCOUNT SUMMARY, BILL PAY FORM, BILL PAY ENROLLMENT]\", \"cnt\": \"9\" }] }] }";
		var s_data = "{\"results\": [{ \"data\": [";
		
		
		//(selectedDataSource.getUnderlyingDataAsync()).then(function (dataTable) {
		tableau.extensions.dashboardContent.dashboard.worksheets.find(w => w.name === s_work_sheet_name).getUnderlyingDataAsync().then(function (dataTable) {
			
			//alert(JSON.stringify(dataTable.columns));
			//for (let column of dataTable.columns) {
			//	//alert(JSON.stringify(column));
			//	//alert(column._fieldName);
			//	if ($("#s_path_fields").val() == column._fieldName ||
			//		$("#s_count_fields").val() == column._fieldName) {
			//		//s_data += column._fieldName + "::";
			//		s_data += JSON.stringify(column) + "::";
			//	}
			//}
			
			for (let row of dataTable.data) {
				//s_data += row[$("#s_path_fields").val()].value + "::" + row[$("#s_count_fields").val()].value + "<br>";
				//s_data += "{ \"path\": \"[ACCOUNT SUMMARY, BILL PAY FORM, BILL PAY ENROLLMENT]\", \"cnt\": 9 }, ";
				s_data += "{ \"path\": \"" + row[$("#s_path_fields").val()].value + "\", \"cnt\": " + row[$("#s_count_fields").val()].value + " }, ";
				//s_data += "{ \"path\": \"" + row[0].value + "\", \"cnt\": " + row[1].value + " }, ";
			}
		
			s_data = s_data.substring(0, s_data.length - 2);
			s_data += "] }] }";
			
			//$("#div_test").html(JSON.stringify(dataTable));
			//$("#div_test").html(s_data);
			
			data = JSON.parse(s_data);
			//alert(data);
			//alert(JSON.stringify(data, getCircularReplacer()));
			
			setTimeout(function() {
				callRunTree();
			}, 100);
			
			
			//var data = t.getData();
			//var columns = t.getColumns();
			//alert(columns);
		});
		
		if (i_set_event_listeners == 0) {
			tableau.extensions.dashboardContent.dashboard.getParametersAsync().then(function (parameters) {
				parameters.forEach(function (p) {
					p.addEventListener(tableau.TableauEventType.ParameterChanged, onParameterChange);
					//alert(p.name);
				});
				i_set_event_listeners = 1;
			});
		}

	}
	
	function onParameterChange (parameterChangeEvent) {
		setTimeout(function() {
			loadDataSource();
		}, 1000);
		//parameterChangeEvent.getParameterAsync().then(function (param) {
		//	const newRow = parameterRow(param);
		//	const oldRow = $("tr[data-fieldname='" + param.id + "'");
		//	oldRow.replaceWith(newRow);
		//});
	}
	
	// This variable will save off the function we can call to unregister listening to marks-selected events
	let unregisterEventHandlerFunction;
	
	function loadSelectedMarks (worksheetName) {
		
		
		
		// Remove any existing event listeners
		if (unregisterEventHandlerFunction) {
		  unregisterEventHandlerFunction();
		}
		
		data = {};
		$("#div_store_flow").html("");
		
		var s_data = "{\"results\": [{ \"data\": [";
		
		// Get the worksheet object we want to get the selected marks for
		const worksheet = getSelectedSheet(worksheetName);
		
		//alert(worksheetName);

		// Set our title to an appropriate value
		//$('#selected_marks_title').text(worksheet.name);

		// Call to get the selected marks for our sheet
		worksheet.getSelectedMarksAsync().then(function (marks) {
			// Get the first DataTable for our selected marks (usually there is just one)
			const worksheetData = marks.data[0];
			
			for (let row of worksheetData.data) {
				s_data += "{ \"path\": \"" + row[$("#s_path_fields").val()].value + "\", \"cnt\": " + row[$("#s_count_fields").val()].value + " }, ";
			}
			
			s_data = s_data.substring(0, s_data.length - 2);
			s_data += "] }] }";
			
			data = JSON.parse(s_data);
			alert(JSON.stringify(data, getCircularReplacer()));
			
			setTimeout(function() {
				callRunTree();
			}, 0);
			
			//alert(JSON.stringify(worksheetData, getCircularReplacer()));

			//// Map our data into the format which the data table component expects it
			//const data = worksheetData.data.map(function (row, index) {
			//	const rowData = row.map(function (cell) {
			//		return cell.formattedValue;
			//	});
            //
			//	return rowData;
			//});
            //
			//const columns = worksheetData.columns.map(function (column) {
			//	return { title: column.fieldName };
			//});
            //
			//// Populate the data table with the rows and columns we just pulled out
			//populateDataTable(data, columns);
		});
		
		// Add an event listener for the selection changed event on this sheet.
		unregisterEventHandlerFunction = worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, function (selectionEvent) {
		  // When the selection changes, reload the data
		  loadSelectedMarks(worksheetName);
		});
		
	}

	
	
	function createButton (buttonTitle) {
		const button = $(`<button type='button' class='btn btn-default btn-block'>${buttonTitle}</button>`);
		return button;
	}


	function populateDataTable (data, columns) {
		// Do some UI setup here to change the visible section and reinitialize the table
		$('#data_table_wrapper').empty();

		if (data.length > 0) {
			$('#no_data_message').css('display', 'none');
			$('#data_table_wrapper').append(`<table id='data_table' class='table table-striped table-bordered'></table>`);

			// Do some math to compute the height we want the data table to be
			var top = $('#data_table_wrapper')[0].getBoundingClientRect().top;
			var height = $(document).height() - top - 130;

			// Initialize our data table with what we just gathered
			$('#data_table').DataTable({
				data: data,
				columns: columns,
				autoWidth: false,
				deferRender: true,
				scroller: true,
				scrollY: height,
				scrollX: true,
				dom: "<'row'<'col-sm-6'i><'col-sm-6'f>><'row'<'col-sm-12'tr>>" // Do some custom styling
			});
		} else {
			// If we didn't get any rows back, there must be no marks selected
			$('#no_data_message').css('display', 'inline');
		}
	}

	//function initializeButtons () {
	//	$('#show_choose_datasource_button').click(showChooseDataSourceDialog);
	//}

	function getSelectedSheet (worksheetName) {
		// Go through all the worksheets in the dashboard and find the one we want
		return tableau.extensions.dashboardContent.dashboard.worksheets.find(function (sheet) {
			return sheet.name === worksheetName;
		});
	}

	const getCircularReplacer = () => {
		const seen = new WeakSet();
		return (key, value) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) {
					return;
				}
				seen.add(value);
			}
			return value;
		};
	};

  
})();
