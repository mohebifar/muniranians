const ifClient = hoc => (!__SERVER__ ? hoc : a => a)

export { ifClient }
