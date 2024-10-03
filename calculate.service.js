const countsOfInstancesSeparately = {
  modules: {
    ims: {
      withoutPrinting: {},
      withPrinting: {},
    },
    strabag: {
      withoutPrinting: {},
      withPrinting: {},
    },
    ub2c: {
      withoutPrinting: {},
      withPrinting: {},
    },
    hsw: {
      withoutPrinting: {},
      withPrinting: {},
    },
    iqm: {
      withoutPrinting: {},
      withPrinting: {},
    },
    platform: {
      withoutPrinting: {},
      withPrinting: {},
    },
    mischek: {
      withoutPrinting: {},
      withPrinting: {},
    },
    academy: {
      withoutPrinting: {},
      withPrinting: {},
    },
  },
  systemConfModules: {
    ims: {
      withoutPrinting: {},
      withPrinting: {},
    },
    strabag: {
      withoutPrinting: {},
      withPrinting: {},
    },
    ub2c: {
      withoutPrinting: {},
      withPrinting: {},
    },
    hsw: {
      withoutPrinting: {},
      withPrinting: {},
    },
    iqm: {
      withoutPrinting: {},
      withPrinting: {},
    },
    platform: {
      withoutPrinting: {},
      withPrinting: {},
    },
    mischek: {
      withoutPrinting: {},
      withPrinting: {},
    },
    academy: {
      withoutPrinting: {},
      withPrinting: {},
    },
  },
};

const instances = {
  ims: 'ims.iris-4.com',
  strabag: 'strabag.iris-4.com',
  ub2c: 'ub2c.iris-4.com',
  hsw: 'hsw.strabag.io',
  iqm: 'iqm-ch.iris-4.com',
  platform: 'platform.strabag.io',
  mischek: 'mischek.iris-4.com',
  academy: 'academy.iris-4.com',
}

function getURLData(url) {
  try {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/').filter(Boolean);
    const fullPath = urlObj.pathname;
    const withPrinting = url.includes('print');
    const isSystemConfiguration = url.includes('/ui/ui/configuration/');
    const tail = '%22';
    let module = segments.slice(2, 3)[0];
    let systemModule;

    if (module.includes(tail)) {
      module = module.replace(tail, '');
    }

    if (isSystemConfiguration) {
      systemModule = url.split('/').slice(7,8)[0];
    }

    if (fullPath.startsWith('/ui/ui/')) {
      return {
        fullUrl: url,
        domain: urlObj.hostname,
        module,
        withPrinting,
        isSystemConfiguration,
        systemModule,
      };
    }
    return null;
  } catch (e) {
    return null;
  }
}

  function groupByModules(row, countsOfModules, countsOfModulesWithPrinting) {
  let module = row['module'];
  const withPrinting = row['withPrinting'] === 'false' ? false : true;

  if (withPrinting) {
    countsOfModulesWithPrinting[module] = (countsOfModulesWithPrinting[module] || 0) + 1;
  } else {
    countsOfModules[module] = (countsOfModules[module] || 0) + 1;
  }
}

  function groupSystemConfModules(row, countsOfSystemConfigModules, countsOfSystemConfigModulesWithPrinting) {
  const withPrinting = row['withPrinting'] === 'false' ? false : true;
  const isSystemConfiguration = row['isSystemConfiguration'] === 'false' ? false : true;

  if (isSystemConfiguration) {
    const systemModule = row['systemModule'];

    if (withPrinting) {
      countsOfSystemConfigModulesWithPrinting[systemModule] = (countsOfSystemConfigModulesWithPrinting[systemModule] || 0) + 1;
    } else {
      countsOfSystemConfigModules[systemModule] = (countsOfSystemConfigModules[systemModule] || 0) + 1;
    }
  }
}

function groupByInstances(row, countsOfInstances) {
  const domain = row['domain'];
  countsOfInstances[domain] = (countsOfInstances[domain] || 0) + 1;
}

function groupByInstancesSeparately(row, countsOfInstancesSeparately) {
  const domain = row['domain'];

  switch(domain) {
    case instances.ims:
      groupByModules(row, countsOfInstancesSeparately.modules.ims.withoutPrinting, countsOfInstancesSeparately.modules.ims.withPrinting);
      groupSystemConfModules(row, countsOfInstancesSeparately.systemConfModules.ims.withoutPrinting, countsOfInstancesSeparately.systemConfModules.ims.withPrinting);
      break;
    case instances.strabag:
      groupByModules(row, countsOfInstancesSeparately.modules.strabag.withoutPrinting, countsOfInstancesSeparately.modules.strabag.withPrinting);
      groupSystemConfModules(row, countsOfInstancesSeparately.systemConfModules.strabag.withoutPrinting, countsOfInstancesSeparately.systemConfModules.strabag.withPrinting);
      break;
    case instances.ub2c:
      groupByModules(row, countsOfInstancesSeparately.modules.ub2c.withoutPrinting, countsOfInstancesSeparately.modules.ub2c.withPrinting);
      groupSystemConfModules(row, countsOfInstancesSeparately.systemConfModules.ub2c.withoutPrinting, countsOfInstancesSeparately.systemConfModules.ub2c.withPrinting);
      break;
    case instances.hsw:
      groupByModules(row, countsOfInstancesSeparately.modules.hsw.withoutPrinting, countsOfInstancesSeparately.modules.hsw.withPrinting);
      groupSystemConfModules(row, countsOfInstancesSeparately.systemConfModules.hsw.withoutPrinting, countsOfInstancesSeparately.systemConfModules.hsw.withPrinting);
      break;
    case instances.iqm:
      groupByModules(row, countsOfInstancesSeparately.modules.iqm.withoutPrinting, countsOfInstancesSeparately.modules.iqm.withPrinting);
      groupSystemConfModules(row, countsOfInstancesSeparately.systemConfModules.iqm.withoutPrinting, countsOfInstancesSeparately.systemConfModules.iqm.withPrinting);
      break;
    case instances.platform:
      groupByModules(row, countsOfInstancesSeparately.modules.platform.withoutPrinting, countsOfInstancesSeparately.modules.platform.withPrinting);
      groupSystemConfModules(row, countsOfInstancesSeparately.systemConfModules.platform.withoutPrinting, countsOfInstancesSeparately.systemConfModules.platform.withPrinting);
      break;
    case instances.mischek:
      groupByModules(row, countsOfInstancesSeparately.modules.mischek.withoutPrinting, countsOfInstancesSeparately.modules.mischek.withPrinting);
      groupSystemConfModules(row, countsOfInstancesSeparately.systemConfModules.mischek.withoutPrinting, countsOfInstancesSeparately.systemConfModules.mischek.withPrinting);
      break;
    case instances.academy:
      groupByModules(row, countsOfInstancesSeparately.modules.academy.withoutPrinting, countsOfInstancesSeparately.modules.academy.withPrinting);
      groupSystemConfModules(row, countsOfInstancesSeparately.systemConfModules.academy.withoutPrinting, countsOfInstancesSeparately.systemConfModules.academy.withPrinting);
      break;
  }
}

module.exports = {
  countsOfInstancesSeparately,
  instances,
  getURLData,
  groupByModules,
  groupSystemConfModules,
  groupByInstances,
  groupByInstancesSeparately,
};
