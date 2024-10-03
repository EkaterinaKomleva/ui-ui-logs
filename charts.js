async function fetchCalculations() {
  const waiting = document.createElement('p');
  waiting.textContent = 'Please wait...';
  waiting.style.fontFamily = 'Helvetica, Arial, sans-serif';
  const targetElement = document.getElementById('container1');
  document.body.insertBefore(waiting, targetElement);

  try {
    const response = await fetch('http://localhost:3000/calculations');
    if (!response.ok) {
      throw new Error('NET ERR');
    }

    const calculations = await response.json();
    console.log(calculations);
    const categoriesForModules = Object.keys(calculations.countsOfModules);
    const categoriesForSystemConf = Object.keys(calculations.countsOfSystemConfigModules);

    addChart(
      'container1',
      'ALL INSTANCES: groupping by modules',
      categoriesForModules,
      calculations.countsOfModules,
      calculations.countsOfModulesWithPrinting,
      calculations.countOfDays,
      );

    addChart(
      'container2',
      'ALL INSTANCES: groupping by system configuration modules',
      categoriesForSystemConf,
      calculations.countsOfSystemConfigModules,
      calculations.countsOfSystemConfigModulesWithPrinting,
      calculations.countOfDays,
      );

    addAllInstancesChart(calculations.countsOfInstances, calculations.countOfDays);

    const instancesByModules = calculations.countsOfInstancesSeparately.modules;
    const instancesBySystemConfModules = calculations.countsOfInstancesSeparately.systemConfModules;

    Object.keys(instancesByModules).forEach((instance, index) => {
      const container = 'container' + (index + 4);

      addChart(
        container,
        `${instance}: groupping by modules`,
        categoriesForModules,
        instancesByModules[instance].withoutPrinting,
        instancesByModules[instance].withPrinting,
        calculations.countOfDays,
        );
    });

    Object.keys(instancesBySystemConfModules).forEach((instance, index) => {
      const container = 'container' + (index + 11);

      addChart(
        container,
        `${instance}: groupping by system configuration modules`,
        categoriesForSystemConf,
        instancesBySystemConfModules[instance].withoutPrinting,
        instancesBySystemConfModules[instance].withPrinting,
        calculations.countOfDays,
        );
    });

    waiting.remove();
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
}

fetchCalculations();

function addChart(container, name, categories, withoutPrinting, withPrinting, countOfDays) {
  Highcharts.chart(container, {
    chart: {
      type: 'column',
    },
    title: {
      text: name,
      align: 'center',
    },
    xAxis: {
      categories: categories,
      accessibility: {
        description: 'Instances',
      },
    },
    yAxis: {
      type: 'logarithmic',
      title: {
        text: `Count of requests (in ${countOfDays} days)`,
      },
    },
    tooltip: {
      valueSuffix: ' (requests)',
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        events: {
          click: async function (event) {
            const chartName = event.point.series.chart.title.textStr;
            const indexOfColon = chartName.indexOf(':');
            const instanceName = chartName.slice(0, indexOfColon);
            const category = event.point.category;
            const isSystemConfiguration = chartName.includes('system configuration');

            if (instanceName !== 'ALL INSTANCES') {
              const print = event.point.series.name === 'With printing' ? true : false;
              const response = await fetch(`http://localhost:3000/instance-data?instance=${instanceName}&print=${print}&category=${category}&isSystemConfiguration=${isSystemConfiguration}`);

              if (!response.ok) {
                throw new Error('NET ERR');
              }

              const filename = `${category}.txt`;
              const urls = await response.json();
              const blob = new Blob(urls, { type: 'text/json' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = filename;
              link.click();
            }
          }
        }
      },
    },
    series: [
      {
        name: 'Without printing',
        data: adjustSeries(categories, withoutPrinting),
      },
      {
        name: 'With printing',
        data: adjustSeries(categories, withPrinting),
      },
    ],
  });
}

function addAllInstancesChart(countsOfInstances, countOfDays) {
  Highcharts.chart('container3', {
    chart: {
      type: 'column',
    },
    title: {
      text: 'ALL INSTANCES: domains',
      align: 'center',
    },
    xAxis: {
      categories: Object.keys(countsOfInstances),
      labels: {
        rotation: -45,
        style: {
          whiteSpace: 'nowrap',
        },
      },
        accessibility: {
          description: 'Instances',
        },
    },
    yAxis: {
      type: 'logarithmic',
      title: {
        text: `Count of requests (in ${countOfDays} days)`,
      },
    },
    tooltip: {
      valueSuffix: ' (requests)'
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: 'domains',
        data: Object.values(countsOfInstances),
      },
    ],
  });
}

function adjustSeries(categories, series) {
    const adjustedSeries = {};

    categories.forEach(category => {
      if (Object.keys(series).includes(category)) {
        adjustedSeries[category] = series[category];
      } else {
        adjustedSeries[category] = 0;
      }
    });

    return Object.values(adjustedSeries);
}
