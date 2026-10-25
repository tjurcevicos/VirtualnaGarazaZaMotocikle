function KatalogDijelova({ words, parts, services, partName, error, onNameChange, onAdd, onRemove, deleteLabel }) {
  const w = (index) => words[index] || index

  return (
    <section className="service-parts-catalog" aria-label={w(0)}>
      <h2>{w(0)}</h2>
      <form className="service-parts-add" onSubmit={onAdd}>
        <label htmlFor="partName">{w(1)}</label>
        <div className="service-parts-add-row">
          <input id="partName" value={partName} onChange={(event) => onNameChange(event.target.value)} maxLength={80} />
          <button className="primary-button" type="submit">{w(2)}</button>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>
      {parts.length === 0 ? <p>{w(7)}</p> : (
        <div className="service-parts-list">
          {parts.map((part) => (
            <div className="service-parts-item" key={part.id}>
              <span>{part.name}</span>
              <button type="button" className="service-delete-button" aria-label={`${w(9)}: ${part.name}`} onClick={() => onRemove(part.id)} disabled={services.some((service) => (service.partIds || []).includes(part.id))}>{deleteLabel}</button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default KatalogDijelova
