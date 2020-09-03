import { reactive, ref } from "@vue/composition-api";
export function paginationHook() {
    const pageData = reactive({
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40],
        total: 100
    })
    //统计数据总和
    const totalCount = (val) =>{
        pageData.total = val;
    }

    const handleSizeChange = (val) => {
        pageData.pageSize = val;
    }
    const handleCurrentChange = (val) => {
        pageData.currentPage = val;
    }
    return {
        pageData,
        handleSizeChange,
        handleCurrentChange,
        totalCount
    }
}