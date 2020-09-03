import { requestUrl } from "../api/requestUrl";
import { loadTableData } from "../api/common";
let tableLoadData = {
    data() {
        return {
        }
    },
    created() {

    },
    mounted() {
        this.tableLoadData()
    },
    methods: {
        tableLoadData() {
            let requestJson = this.tableConfig.requestData;
            let requestData = {
                url: requestUrl[requestJson.url],
                method: requestJson.method,
                data: requestJson.data
            };
            loadTableData(requestData)
                .then(Response => {
                    let responseData = Response.data.data.data;
                    if (responseData && responseData.length > 0) {
                        //赋值
                        this.tableData = responseData;
                        //数据统计
                        this.total = Response.data.data.total;
                    }
                })
                .catch(error => { });
        }
    }
}

export default tableLoadData;