import { useState, useMemo } from 'react'

export const usePagination = <T,>(items: T[], defaultItemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(0)

  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)
  const totalPages = useMemo(
    () => Math.ceil(items.length / itemsPerPage),
    [items, itemsPerPage]
  )
  const setPage = (page: number) => {
    setCurrentPage(Math.min(page, totalPages - 1))
  }
  const setLastPage = () => {
    setCurrentPage(totalPages - 1)
  }

  const showPagination = useMemo(
    () => items.length > Math.min(defaultItemsPerPage, itemsPerPage),
    [items, itemsPerPage, defaultItemsPerPage]
  )

  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    return items.slice(start, end)
  }, [currentPage, itemsPerPage, items])

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    setPage,
    setLastPage,
    setItemsPerPage,
    showPagination,
    currentItems,
  }
}
