import styled from "styled-components";

export const ContainerTable = styled.div`
	.ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
	.ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td,
	.ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td,
	.ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
		background:unset !important;
	}
`