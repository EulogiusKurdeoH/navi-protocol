import React, { useEffect, useState } from "react";
import { message, Table } from "antd";
import { getPools } from "@naviprotocol/lending";

interface PoolData {
    poolId: string;
    depositRate: string;
    borrowRate: string;
    totalDeposit: string;
    totalBorrow: string;
}

const PoolsTable: React.FC = () => {
const [pools, setPools] = useState<PoolData[]>([]);

    useEffect(() => {
    async function fetchPools() {
    try {
        const result = await getPools({
            env: "prod",
            cacheTime: 30000,
        });

        console.log("Raw pools data:", result);

        const mapped = result.map((p: any) => ({
            poolId: p.token?.symbol || p.id || "-",
            depositRate: p.supplyIncentiveApyInfo?.apy || "0",
            borrowRate: p.borrowIncentiveApyInfo?.apy || "0",
            totalDeposit: p.totalSupply || "0",
            totalBorrow: p.totalBorrow || "0",
        }));

        setPools(mapped);
        } catch (error) {
        console.error("!Error fetching pools:", error);
        message.error("Failed to fetch pools data.");
        }
    }

    fetchPools();
    }, []);

    const columns = [
        { title: "Pool ID", dataIndex: "poolId" },
        { title: "Deposit Rate (APY %)", dataIndex: "depositRate"},
        { title: "Borrow Rate (APY %)", dataIndex: "borrowRate" },
        { title: "Total Deposit", dataIndex: "totalDeposit" },
        { title: "Total Borrow", dataIndex: "totalBorrow" },
    ];

    return (
    <div style={{ padding: "20px" }}>
        <h2 style={{textAlign: "center", color: "Black"}}>NAVI Pools Data</h2>
        <Table
            dataSource={pools}
            columns={columns}
            rowKey="poolId"
            bordered
        />
    </div>
    );
};

export default PoolsTable;
