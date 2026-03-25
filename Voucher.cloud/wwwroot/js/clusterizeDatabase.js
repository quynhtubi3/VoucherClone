"use strict";

class ClusterizeDatabase {
    constructor(options = {}) {
        this.data = [];
        this.row_data = [];
        this.row_data_id = [];
        this.data_filter = [];
        this.current_row_id = "";
        this.current_row_data = null;
        this.selected_row_ids = [];
        this.selected_column_ids = [];
        this.column_selected_index = null;
        this.scroll_top = 0; 
        this.PrimaryKey = "Id";
        if (options.PrimaryKey)
            this.PrimaryKey = options.PrimaryKey;
    }

    RowStateAdded(id) {
        let self = this;
        var index = this.data.findIndex(function (o) {
            return o[self.PrimaryKey] == id;
        })
        if (index != -1) {
            this.data[index].RowState = 1;// state 0: unchanged 1: added 2:modified 3:deleted
        }
    }

    RowStateModified(id) {
        let self = this;
        var index = this.data.findIndex(function (o) {
            return o[self.PrimaryKey] == id;
        })
        if (index != -1 && this.data[index].RowState == 0) {
            this.data[index].RowState = 2;// state 0: unchanged 1: added 2:modified 3:deleted
        }
    }

    RowStateDeleted(id) {
        let self = this;
        var index = this.data.findIndex(function (o) {
            return o[self.PrimaryKey] == id;
        })
        if (index != -1) {
            if (this.data[index].RowState == 1) {
                this.data.splice(index, 1);
                this.row_data_id.splice(index, 1);
            } else {
                this.data[index].RowState = 3;// state 0: unchanged 1: added 2:modified 3:deleted
            }
        }
    }

    //Được sử dụng khi xóa dòng
    ResetCurrentRowId(index) {
        if (this.data.length == 0) {
            this.current_row_id = "";
        } else {
            let data = this.data.filter(function (row) {
                return row.RowState != 3;
            });

            if (index < data.length) {
                this.current_row_id = data[index][this.PrimaryKey];
            } else {
                this.current_row_id = data[index - 1][this.PrimaryKey];
            }
        }
    }

    CurrentRowData() {
        let self = this;
        if (self.data.length == 0) {
            self.current_row_data = null;
        } else {
            if (self.current_row_data == null || self.current_row_data[self.PrimaryKey] != self.current_row_id) {
                let current_row_id = self.current_row_id;
                let index = self.data.findIndex(function (o) {
                    return o[self.PrimaryKey] == current_row_id;
                })
                if (index != -1) {
                    self.current_row_data = self.data[index];
                }
            }
        }
        return this.current_row_data;
    }

    ElementRowData(element) {
        let self = this;
        let result = null;
        if (self.data.length > 0) {
            let rowId = $(element).closest("tr").find("th").attr("clusterize_row_id");
            let index = self.data.findIndex(function (o) {
                return o[self.PrimaryKey] == rowId;
            })
            if (index != -1) {
                result = self.data[index];
            }
        }
        return result;
    }

    SetPrimaryKey(key) {
        this.PrimaryKey = key;
    }
}

class ClusterizeDatabaseReport extends ClusterizeDatabase {
    constructor(options = {}) {
        super(options);
        this.check_detail_most = false;
    }
}

class ClusterizeDatabaseInvoice extends ClusterizeDatabase {
    constructor(options = {}) {
        super(options);        
        this.current_full_master_row = null;
    }
}
//export default Translator;
