import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import search from '../../assets/images/other/search.png';
import { Select } from 'antd';
import { capitalizeString } from '../../utils/handleString';

const RadialBarChart = ({ children }) => {
    const state = {
        series: [...children.dataValue],
        options: {
            chart: {
                type: 'radialBar'
            },
            colors: [...children.colors],

            plotOptions: {
                radialBar: {
                    dataLabels: {
                        name: {
                            fontSize: '22px'
                        },
                        value: {
                            fontSize: '16px'
                        },
                        total: {
                            show: true,
                            label: 'Tổng tiến độ',
                            formatter: function () {
                                return children.average + '%';
                            }
                        }
                    }
                }
            },
            labels: [...children.dataCategory]
        }
    };
    return (
        <>
            <ReactApexChart
                options={state.options}
                series={state.series}
                type="radialBar"
                height="280px"
                width="250px"
            />
        </>
    );
};

const SubChart = ({ caterogy, color }) => {
    return (
        <div className="subchart__item">
            <div
                className="color"
                style={{
                    backgroundColor: color,
                    width: '50px',
                    height: '25px'
                }}
            ></div>
            <div className="sub" style={{ color: color }}>
                {caterogy}
            </div>
        </div>
    );
};

const LayoutChart = ({ chartData, auth, setLevelYear }) => {
    const colors = [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#bd517d',
        '#a2aa48',
        '#c71d91',
        '#81ceda',
        '#227c3e',
        '#14c9a7',
        '#f8674f',
        '#13098e',
        '#bc2b4d',
        '#f91190'
    ];

    let totalQuantityDemanded = 0;
    let totalProgress = 0;

    const dataValue = chartData.map((item) => {
        const value = item.quantityDemanded == 0 ? 100 : item.value;
        totalQuantityDemanded += item.quantityDemanded;
        totalProgress += value * item.quantityDemanded;
        return parseFloat(value.toFixed(2));
    });

    const dataCategory = chartData.map((item) => capitalizeString(item.caterogy));
    const average = totalQuantityDemanded > 0 ? (totalProgress / totalQuantityDemanded).toFixed(2) : 0;
    const [yearList, setYearList] = useState([]);
    const levelYear = auth.user?.cohort.currentLevelYear;

    const statistical = {
        dataValue,
        dataCategory,
        average,
        colors
    };

    useEffect(() => {
        if (levelYear) {
            const yearsData = [];
            for (let i = 1; i <= levelYear; i++) {
                yearsData.push({
                    value: i,
                    label: `Năm ${i}`
                });
            }
            setYearList(yearsData);
        }
    }, [levelYear]);

    return (
        <div className="container__chart">
            <header className="heading-4">
                <span>Tiến Độ Hoàn Thành Các Nhóm Chỉ Tiêu</span>
                <Select
                    labelInValue
                    onChange={(e) => {
                        setLevelYear(e.value);
                    }}
                    defaultValue={{
                        value: levelYear,
                        label: `Năm ${levelYear}`
                    }}
                    style={{
                        width: '120px',
                        marginLeft: '20px'
                    }}
                    options={yearList}
                />
            </header>
            {dataValue.length === 0 ? (
                <div className="notify_nothing">
                    <img src={search} className="notify_nothing_img" alt="search_image" />
                    <span>Các nhóm chỉ tiêu chưa được tạo</span>
                </div>
            ) : (
                <div className="content">
                    <div className="chart__graph">
                        <RadialBarChart>{statistical}</RadialBarChart>
                    </div>
                    <div className="chart__sub">
                        {dataCategory.map((item, index) => (
                            <SubChart key={index} caterogy={item} color={colors[index]} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LayoutChart;
