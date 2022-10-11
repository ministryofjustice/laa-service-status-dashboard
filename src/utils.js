const filterServices = (services, displayOnly) => {
  return services
    .filter(item => (!displayOnly || item.display))
    .sort(ascSort)
}

const ascSort = (itemA, itemB) => {
  if (itemA.name.trim().toLowerCase() >
    itemB.name.trim().toLowerCase()) {
    return 1
  }
  return -1
}

export { filterServices };
