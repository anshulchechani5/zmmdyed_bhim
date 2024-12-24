sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,UIComponent,MessageToast,MessageBox,JSONModel) {
        "use strict";

        return Controller.extend("zmmdyedbhim.controller.View1", {
            onInit: function () {
                var dt = new Date();
                var dt1 = dt.getFullYear() + '-' + Number(dt.getMonth() + 1) + '-' + dt.getDate() ;
                var dt2 = dt1.split("-")

                if (dt2[1].length != 2) {
                    var dt3 = dt2[0] + "-" + 0 + dt2[1] + "-" + dt2[2]
                } else {
                    dt3 = dt2
                }
                var oPayloadObject = {
                    "PostingDate": dt3
                }
                this.getView().setModel(new sap.ui.model.json.JSONModel(oPayloadObject), "oPayloadData");
                this.getView().setModel(new sap.ui.model.json.JSONModel(oPayloadObject), "oPayloadData1");
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);
            },
            onaddtable: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait ..."
                });
                oBusyDialog.open();
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);
                    var puchaseorder = this.getView().byId("idpuchaseorder").getValue();
                    var docdate = this.getView().byId("docdate").getValue();
                    var PostingDate = this.getView().byId("PostingDate").getValue();

                    if(puchaseorder=== ""){
                        oBusyDialog.close();
                      MessageBox.error("Please Enter Puchase Order");
                    }
                    else
                    if(docdate=== ""){
                        oBusyDialog.close();
                      MessageBox.error("Please Select Document Date");
                    }
                    else
                    if(PostingDate=== ""){
                        oBusyDialog.close();
                      MessageBox.error("Please Select Posting Date");
                    }
                    else{
                        var materialcode = this.getView().byId("idmaterialcode").getValue();
                        var setCode = this.getView().byId("idsetCode").getValue();
                    if(materialcode ==="" && setCode ===""){
                        var oInput1 = this.getView().byId("idsupliername");
                        var oInput = this.getView().byId("idsuplier");
                        var TableModel = this.getView().getModel("oTableDataModel");
                        var aTableArr = TableModel.getProperty("/aTableData"); 
                        var oModel = this.getView().getModel();
                        var oFilter1 = new sap.ui.model.Filter("PurchaseOrder", "EQ", puchaseorder);
                        oModel.read("/DyedDispatch", {
                            urlParameters:{"$top": "50000"},
                            filters: [oFilter1],
                            success: function (oresponse) {
                                if (oresponse.results.length === 0) {
                                    oBusyDialog.close();
                                    MessageBox.error("Wrong Puchase Order No");
                                }
                                else {
                                    var Supplier =oresponse.results[0].Supplier;
                                    var Suppliername =oresponse.results[0].SupplierName;
                                    oInput.setValue(Supplier);
                                    oInput1.setValue(Suppliername);
                                    var data1 = oresponse.results.map((res)=>{return{...res,PurchaseOrderItem:Number(res.PurchaseOrderItem)}}).sort((a,b)=>a.PurchaseOrderItem-b.PurchaseOrderItem);;
                                    
                                    for (var i = 0; i < data1.length; i++) {
                                        var obj = {
                                            sno: String(i+1),
                                            matcode: data1[i].Material,
                                            matdescrption: data1[i].ProductDescription,
                                            quantity: data1[i].MatlWrhsStkQtyInMatlBaseUnit,
                                            uom: data1[i].MaterialBaseUnit,
                                            setcode: data1[i].Batch,
                                            plant:data1[i].Plant,
                                            sloc: data1[i].StorageLocation,
                                            salesorder: data1[i].SDDocument,
                                            soitem: data1[i].SDDocumentItem,
                                            beamparty: data1[i].PartyBeam,
                                            greysort: data1[i].GreyFebric,
                                            po: data1[i].PurchaseOrder,
                                            poitem: data1[i].PurchaseOrderItem,
                                            tdqty:data1[i].RequiredQuantity,
                                        }
                                        aTableArr.push(obj);
                                        TableModel.setProperty("/aTableData", aTableArr)
                                    }
                                }
                                oBusyDialog.close();
                            }.bind(this),
                            error: function (results) {
                                oBusyDialog.close();
                                MessageBox.error(" Wrong ");
    
                            }
                        })
                    }
                    else
                     if(setCode ===""){
                        var oInput1 = this.getView().byId("idsupliername");
                        var oInput = this.getView().byId("idsuplier");
                        var TableModel = this.getView().getModel("oTableDataModel");
                        var aTableArr = TableModel.getProperty("/aTableData"); 
                        var oModel = this.getView().getModel();
                        var oFilter1 = new sap.ui.model.Filter("PurchaseOrder", "EQ", puchaseorder);
                        var oFilter = new sap.ui.model.Filter("Material", "Contains", materialcode);
                        oModel.read("/DyedDispatch", {
                            urlParameters:{"$top": "50000"},
                            filters: [oFilter1,oFilter],
                            success: function (oresponse) {
                                if (oresponse.results.length === 0) {
                                    oBusyDialog.close();
                                    MessageBox.error("Please Check PO/ Material Entry");
                                }
                                else {
                                    var Supplier =oresponse.results[0].Supplier;
                                    oInput.setValue(Supplier);
                                    var Suppliername =oresponse.results[0].SupplierName;
                                    oInput1.setValue(Suppliername);
                                    var data1 = oresponse.results.map((res)=>{return{...res,PurchaseOrderItem:Number(res.PurchaseOrderItem)}}).sort((a,b)=>a.PurchaseOrderItem-b.PurchaseOrderItem);;
                                    
                                    for (var i = 0; i < data1.length; i++) {
                                        var obj = {
                                            sno: String(i+1),
                                            matcode: data1[i].Material,
                                            matdescrption: data1[i].ProductDescription,
                                            quantity: data1[i].MatlWrhsStkQtyInMatlBaseUnit,
                                            uom: data1[i].MaterialBaseUnit,
                                            setcode: data1[i].Batch,
                                            plant:data1[i].Plant,
                                            sloc: data1[i].StorageLocation,
                                            salesorder: data1[i].SDDocument,
                                            soitem: data1[i].SDDocumentItem,
                                            beamparty: data1[i].PartyBeam,
                                            greysort: data1[i].GreyFebric,
                                            po: data1[i].PurchaseOrder,
                                            poitem: data1[i].PurchaseOrderItem,
                                            tdqty:data1[i].RequiredQuantity,
                                        }
                                        aTableArr.push(obj);
                                        TableModel.setProperty("/aTableData", aTableArr)
                                    }
                                }
                                oBusyDialog.close();
                            }.bind(this),
                            error: function (results) {
                                oBusyDialog.close();
                                MessageBox.error(" Please Check PO/ Material Entry ");
    
                            }
                        })
                    }
                    else
                    if(materialcode ===""){
                        var oInput1 = this.getView().byId("idsupliername");
                       var oInput = this.getView().byId("idsuplier");
                       var TableModel = this.getView().getModel("oTableDataModel");
                       var aTableArr = TableModel.getProperty("/aTableData"); 
                       var oModel = this.getView().getModel();
                       var oFilter1 = new sap.ui.model.Filter("PurchaseOrder", "EQ", puchaseorder);
                       var oFilter = new sap.ui.model.Filter("Batch", "Contains", setCode);
                       oModel.read("/DyedDispatch", {
                           urlParameters:{"$top": "50000"},
                           filters: [oFilter1,oFilter],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Please Check PO/ Set Code Entry");
                               }
                               else {
                                   var Supplier =oresponse.results[0].Supplier;
                                   oInput.setValue(Supplier);
                                   var Suppliername =oresponse.results[0].SupplierName;
                                    oInput1.setValue(Suppliername);
                                   var data1 = oresponse.results.map((res)=>{return{...res,PurchaseOrderItem:Number(res.PurchaseOrderItem)}}).sort((a,b)=>a.PurchaseOrderItem-b.PurchaseOrderItem);;
                                    
                                    for (var i = 0; i < data1.length; i++) {
                                        var obj = {
                                            sno: String(i+1),
                                            matcode: data1[i].Material,
                                            matdescrption: data1[i].ProductDescription,
                                            quantity: data1[i].MatlWrhsStkQtyInMatlBaseUnit,
                                            uom: data1[i].MaterialBaseUnit,
                                            setcode: data1[i].Batch,
                                            plant:data1[i].Plant,
                                            sloc: data1[i].StorageLocation,
                                            salesorder: data1[i].SDDocument,
                                            soitem: data1[i].SDDocumentItem,
                                            beamparty: data1[i].PartyBeam,
                                            greysort: data1[i].GreyFebric,
                                            po: data1[i].PurchaseOrder,
                                            poitem: data1[i].PurchaseOrderItem,
                                            tdqty:data1[i].RequiredQuantity,
                                        }
                                        aTableArr.push(obj);
                                        TableModel.setProperty("/aTableData", aTableArr)
                                    }
                               }
                               oBusyDialog.close();
                           }.bind(this),
                           error: function (results) {
                               oBusyDialog.close();
                               MessageBox.error("Please Check PO/ Set Code Entry");
   
                           }
                       })
                   }
                   else{
                    var oInput1 = this.getView().byId("idsupliername");
                       var oInput = this.getView().byId("idsuplier");
                       var TableModel = this.getView().getModel("oTableDataModel");
                       var aTableArr = TableModel.getProperty("/aTableData"); 
                       var oModel = this.getView().getModel();
                       var oFilter1 = new sap.ui.model.Filter("PurchaseOrder", "EQ", puchaseorder);
                       var oFilter = new sap.ui.model.Filter("Batch", "Contains", setCode);
                       var oFilter2 = new sap.ui.model.Filter("Material", "Contains", materialcode);
                       oModel.read("/DyedDispatch", {
                           urlParameters:{"$top": "50000"},
                           filters: [oFilter1,oFilter,oFilter2],
                           success: function (oresponse) {
                               if (oresponse.results.length === 0) {
                                   oBusyDialog.close();
                                   MessageBox.error("Please Check PO/Set Code/ Material Entry");
                               }
                               else {
                                   var Supplier =oresponse.results[0].Supplier;
                                   oInput.setValue(Supplier);
                                   var Suppliername =oresponse.results[0].SupplierName;
                                    oInput1.setValue(Suppliername);
                                   var data1 = oresponse.results.map((res)=>{return{...res,PurchaseOrderItem:Number(res.PurchaseOrderItem)}}).sort((a,b)=>a.PurchaseOrderItem-b.PurchaseOrderItem);;
                                    
                                    for (var i = 0; i < data1.length; i++) {
                                        var obj = {
                                            sno: String(i+1),
                                            matcode: data1[i].Material,
                                            matdescrption: data1[i].ProductDescription,
                                            quantity: data1[i].MatlWrhsStkQtyInMatlBaseUnit,
                                            uom: data1[i].MaterialBaseUnit,
                                            setcode: data1[i].Batch,
                                            plant:data1[i].Plant,
                                            sloc: data1[i].StorageLocation,
                                            salesorder: data1[i].SDDocument,
                                            soitem: data1[i].SDDocumentItem,
                                            beamparty: data1[i].PartyBeam,
                                            greysort: data1[i].GreyFebric,
                                            po: data1[i].PurchaseOrder,
                                            poitem: data1[i].PurchaseOrderItem,
                                            tdqty:data1[i].RequiredQuantity,
                                        }
                                        aTableArr.push(obj);
                                        TableModel.setProperty("/aTableData", aTableArr)
                                    }
                               }
                               oBusyDialog.close();
                           }.bind(this),
                           error: function (results) {
                               oBusyDialog.close();
                               MessageBox.error("Please Check PO/Set Code/ Material Entry");
   
                           }
                       })
                   }
                
                    }

            },
            savedata: function () {
                var suplier = this.getView().byId("idsuplier").getValue();
                var puchaseorder = this.getView().byId("idpuchaseorder").getValue();
                var PostingDate=this.getView().byId("PostingDate").getValue();
                var docdate=this.getView().byId("docdate").getValue();
                if(suplier === ""){
                    MessageBox.error("Please Enter Supplier");
                }
                else if(puchaseorder===""){
                    MessageBox.error("Please Enter Puchase Order");
                }
                else if(PostingDate ===""){
                    MessageBox.error("Please Select Posting Date");
                }
                else if(docdate ===""){
                    MessageBox.error("Please Select Document Date");
                }
                else{
                    var aIndices = this.byId("table1").getSelectedIndices();
                    var FirstScreenTableData = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                   
                    for (var i = 0; i < aIndices.length; i++) {
                        var k = aIndices.length -1;
                        var poitem = FirstScreenTableData[aIndices[i]].poitem;
                        var tdqty = Number(FirstScreenTableData[aIndices[i]].tdqty);
                        var qty =0 ;
                        for (var j = 0; j < aIndices.length; j++) {
    
                            if(poitem === FirstScreenTableData[aIndices[j]].poitem){
    
                              qty = qty + Number(FirstScreenTableData[aIndices[j]].quantity);
    
                            }
                        }
                        if(tdqty < qty ){
                          MessageBox.error("Qty is Greater than Target Qty")
                          break;
                        }
                        else if(i===k)
                        {
                            this.savedata1();
                        }
    
                    }
                }
                
             },
            savedata1: function () {
              
                var supliername = this.getView().byId("idsupliername").getValue();
                var suplier = this.getView().byId("idsuplier").getValue();
                var puchaseorder = this.getView().byId("idpuchaseorder").getValue();
                var PostingDate=this.getView().byId("PostingDate").getValue();
                var docdate=this.getView().byId("docdate").getValue();
                if(suplier === ""){
                    MessageBox.error("Please Enter Supplier");
                }
                else if(puchaseorder===""){
                    MessageBox.error("Please Enter Puchase Order");
                }
                else if(PostingDate ===""){
                    MessageBox.error("Please Select Posting Date");
                }
                else if(docdate ===""){
                    MessageBox.error("Please Select Document Date");
                }
                else{
                    var oBusyDialog = new sap.m.BusyDialog({
                        text: "Please wait"
                    });
                    oBusyDialog.open();
                    var docdate=this.getView().byId("docdate").getValue();
                            if(docdate.length === 10 ){
                                var yyyy= docdate.slice(0,4);
                                var mm =docdate.slice(5,7);
                                var dd =docdate.slice(8,10);
                                var dte = yyyy  + mm + dd;
                            }
                            else if(docdate.length === 9 ){
                                var yyyy= docdate.slice(0,4);
                                var mm =docdate.slice(5,7);
                                var dd =docdate.slice(8,9);
                                var dd = "0" + dd;
                                var dte = yyyy  + mm + dd;
                            }
                            else if(docdate.length === 8 ){
                                var yyyy= docdate.slice(0,4);
                                var mm =docdate.slice(5,6);
                                mm = "0" + mm;
                                var dd =docdate.slice(7,8);
                                dd = "0" + dd;
                                var dte = yyyy  + mm + dd;
                            }
    
                            docdate = dte;
    
                            var PostingDate=this.getView().byId("PostingDate").getValue();
                            if(PostingDate.length === 10 ){
                                var yyyy= PostingDate.slice(0,4);
                                var mm =PostingDate.slice(5,7);
                                var dd =PostingDate.slice(8,10);
                                var dte1 = yyyy  + mm + dd;
                            }
                            else if(PostingDate.length === 9 ){
                                var yyyy= PostingDate.slice(0,4);
                                var mm =PostingDate.slice(5,7);
                                var dd =PostingDate.slice(8,9);
                                var dd = "0" + dd;
                                var dte1 = yyyy  + mm + dd;
                            }
                            else if(PostingDate.length === 8 ){
                                var yyyy= PostingDate.slice(0,4);
                                var mm =PostingDate.slice(5,6);
                                mm = "0" + mm;
                                var dd =PostingDate.slice(7,8);
                                dd = "0" + dd;
                                var dte1 = yyyy  + mm + dd;
                            }
                            PostingDate =dte1;
                            var aIndices = this.byId("table1").getSelectedIndices();
                            var FirstScreenTableData = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                            var TableDataArray =[];
                            for (var i = 0; i < aIndices.length; i++) {
                            var oTableData = {
                                 SerialNUMBer:FirstScreenTableData[aIndices[i]].sno,
                                 mAterIalCode:FirstScreenTableData[aIndices[i]].matcode,
                                 Matdescrption:FirstScreenTableData[aIndices[i]].matdescrption,
                                 QuaNtity:FirstScreenTableData[aIndices[i]].quantity,
                                 Uom:FirstScreenTableData[aIndices[i]].uom,
                                 SeTcode:FirstScreenTableData[aIndices[i]].setcode,
                                 pLAnt:FirstScreenTableData[aIndices[i]].plant,
                                 SOLoca:FirstScreenTableData[aIndices[i]].sloc,
                                 soorder:FirstScreenTableData[aIndices[i]].salesorder,
                                 SOitem:FirstScreenTableData[aIndices[i]].soitem,
                                 Beampatry:FirstScreenTableData[aIndices[i]].beamparty,
                                 Greysort:FirstScreenTableData[aIndices[i]].greysort,
                                 POOrder:FirstScreenTableData[aIndices[i]].po,
                                 PoItem:FirstScreenTableData[aIndices[i]].poitem,
                             }
                             TableDataArray.push(oTableData); 
                        }
                         
                        // https://my405100.s4hana.cloud.sap:443/sap/bc/http/sap/zmm_dyed_dispatch_module_http?sap-client=080
                        var url = "/sap/bc/http/sap/zmm_dyed_dispatch_module_http?sap-client=080";
                        $.ajax({
                            type: "post",
                            url: url,
                            data: JSON.stringify({
                                puchaseorder,
                                suplier,
                                docdate,
                                PostingDate,
                                TableDataArray,
                            }),
                            contentType: "application/json; charset=utf-8",
                            traditional: true,
                            success: function (data) {
                                oBusyDialog.close();
                                 var folio =data.split(' ').slice(0, 1)[0];
                                 var meta = data.slice(40);
                                var create=meta.split(' ').slice(0, 1)[0];
                                if( create === 'ERROR'|| folio ==="Error" || create === 'Error' || folio ==="ERROR" ){
                                    MessageBox.error(data);
                                }
                                else{
                                MessageBox.alert(data
                                    , {
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            window.location.reload();
                                        }
                                    }
                                    }
                                );
                                }
                            }.bind(this),
                            error: function (error) {
                                oBusyDialog.close();
                                MessageBox.error(error);
                            }
    
                        });
                }
            },
        });
    });
