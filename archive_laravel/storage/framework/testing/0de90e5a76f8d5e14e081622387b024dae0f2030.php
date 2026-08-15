<div class="container">
    <div class="row justify-content-md-center">
        <div class="col col-lg-8">
            <canvas id="myChart" width="400" height="400"></canvas>
        </div>
    </div>
</div>

<script>
    $(function() {
        var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: <?php echo json_encode($data['labels'], true); ?>,
                datasets: [{
                    label: 'Dataset 1',
                    data: <?php echo json_encode($data['life_path_percent'], true); ?>,
                    backgroundColor: ["#56e289", "#56e2cf", "#56aee2", "#5668e2", "#8a56e2",
                        "#cf56e2", "#e256ae", "#e25668", "#e28956", "#e2cf56", "#aee256",
                        "#68e256"
                    ],
                    borderColor: "#fff"
                }]
            },
            options: {
                scales: {},
                plugins: {
                    tooltips: {
                        enabled: false
                    },
                    datalabels: {
                        color: 'white',
                        font: {
                            weight: 'bold'
                        },
                        formatter: function(value, context) {
                            console.log(value);
                            const display = [`${value}%`]
                            return display;
                        }
                    }
                },
            },
            plugins: [ChartDataLabels]
        });
    });
</script>
<?php /**PATH /home/stackops/www/numerology/resources/views/admin/charts/pie.blade.php ENDPATH**/ ?>