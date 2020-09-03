import { reactive } from "@vue/composition-api";
import { requestUrl } from "../../api/requestUrl";
import { loadTableData } from "../../api/common";
export function LoadData() {
    const tabledata = reactive({
        item: [],
        total: 0
    })

    const tableLoadData = (params) => {
        let requestJson = params;
        let requestData = {
            url: requestUrl[requestJson.url],
            method: requestJson.method,
            data: requestJson.data
        };
        loadTableData(requestData)
            .then(Response => {
                let responseData = Response.data.data.data;
                tabledata.item = responseData;
                tabledata.total = Response.length === 0 ? 0 : Response.data.data.total;
            })
            .catch(error => { });
    }

    return {
        tabledata,
        tableLoadData
    }
}