import React from 'react'
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
import { Tooltip } from 'antd';
import { ShopOutlined } from '@ant-design/icons';

function ExportExcel({excelData, fileName}) {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

  return (
    <Tooltip title="Export To Excel">
        <Button onClick={exportToExcel} icon={<ShopOutlined />}>Export</Button>
    </Tooltip>
  )
}

export default ExportExcel