<script>
  //Importing Bar class from the vue-chartjs wrapper
  import { Line } from 'vue-chartjs'
  //Exporting this so it can be used in other components
  export default {
    extends: Line,
    props: {
        datacollection: {
            type: Object,
            default: null
        }
    },
    data () {
      return {
        //Chart.js options that controls the appearance of the chart
        options: {
            title: {
                display: true,
                text: 'Kidsgen Attendance'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        stepSize: 1
                    },
                    stacked: false,
                    gridLines: {
                        display: true
                    }
                }],
                xAxes: [ {
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        stepSize: 1
                    },
                    stacked: true,
                    gridLines: {
                        display: false
                    }
                }]
            },
            legend: {
                display: true
            },
            responsive: true,
            maintainAspectRatio: false
        }
      }
    },
    mounted () {
      //renderChart function renders the chart with the datacollection and options object.
      this.renderChart(this.datacollection, this.options)
    }
  }
</script>
