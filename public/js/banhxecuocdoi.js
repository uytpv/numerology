const push = document.getElementById('push');
push.addEventListener('click', pushValueChart);

function pushValueChart() {
    myChart.data.datasets[0].data[0] = document.getElementById('old0').value;
    myChart.data.datasets[0].data[1] = document.getElementById('old1').value;
    myChart.data.datasets[0].data[2] = document.getElementById('old2').value;
    myChart.data.datasets[0].data[3] = document.getElementById('old3').value;
    myChart.data.datasets[0].data[4] = document.getElementById('old4').value;
    myChart.data.datasets[0].data[5] = document.getElementById('old5').value;
    myChart.data.datasets[0].data[6] = document.getElementById('old6').value;
    myChart.data.datasets[0].data[7] = document.getElementById('old7').value;

    myChart.data.datasets[1].data[0] = document.getElementById('new0').value;
    myChart.data.datasets[1].data[1] = document.getElementById('new1').value;
    myChart.data.datasets[1].data[2] = document.getElementById('new2').value;
    myChart.data.datasets[1].data[3] = document.getElementById('new3').value;
    myChart.data.datasets[1].data[4] = document.getElementById('new4').value;
    myChart.data.datasets[1].data[5] = document.getElementById('new5').value;
    myChart.data.datasets[1].data[6] = document.getElementById('new6').value;
    myChart.data.datasets[1].data[7] = document.getElementById('new7').value;

    myChart.data.labels[0] = document.getElementById('txt0').value;
    myChart.data.labels[1] = document.getElementById('txt1').value;
    myChart.data.labels[2] = document.getElementById('txt2').value;
    myChart.data.labels[3] = document.getElementById('txt3').value;
    myChart.data.labels[4] = document.getElementById('txt4').value;
    myChart.data.labels[5] = document.getElementById('txt5').value;
    myChart.data.labels[6] = document.getElementById('txt6').value;
    myChart.data.labels[7] = document.getElementById('txt7').value;
    myChart.update();
};
const hienTrang = [5, 5, 5, 5, 5, 5, 5, 5];
const thayDoi = [5, 5, 5, 5, 5, 5, 5, 5];
const labelValues = [
    'Sức khỏe', 'Phát triển bản thân', 'Mối quan hệ', 'Tài chính', 'Sự nghiệp', 'Giải trí', 'Chia sẻ', 'Tâm linh'
];
const data = {
    labels: labelValues,
    datasets: [{
            label: 'Hiện trạng',
            data: hienTrang,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        },
        {
            label: 'Thay đổi',
            data: thayDoi,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }
    ]
};
var ctx = document.getElementById('myChart');
ctx.height = 500;

var myChart = new Chart(ctx, {
    type: 'radar',
    data: data,
    options: {
        elements: {
            line: {
                borderWidth: 3
            }
        },
        scales: {
            r: {
                angleLines: {
                    display: true
                },
                suggestedMin: 0,
                suggestedMax: 10
            }
        }

    }
});