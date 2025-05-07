function ApplicationLayout({ authenticated, open }) {

    const user = null

  return (
    <>
        {
            user === null
            ? open 
            : authenticated
        }
    </>
  )
}
export default ApplicationLayout