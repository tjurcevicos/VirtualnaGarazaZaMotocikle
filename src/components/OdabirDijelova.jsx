function OdabirDijelova({ words, parts, selectedIds, onToggle }) {
  return (
    <fieldset className="service-parts-fieldset">
      <legend>{words[3]}</legend>
      {parts.length === 0 ? <p>{words[7]}</p> : (
        <div className="service-parts-choices">
          {parts.map((part) => (
            <label key={part.id} className="service-parts-choice">
              <input type="checkbox" checked={selectedIds.includes(part.id)} onChange={() => onToggle(part.id)} />
              <span>{part.name}</span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  )
}

export default OdabirDijelova
