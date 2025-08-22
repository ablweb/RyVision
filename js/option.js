export function setupOption(OptionDomain, OptionsValue, onChange, initialKey = 0) {
    // abort if empty
    if (!OptionsValue || Object.keys(OptionsValue).length === 0) return;
    const keys = Object.keys(OptionsValue);

    // clamp initialKey
    if (initialKey < 0 || initialKey >= keys.length) initialKey = 0;
    const currentKey = keys[initialKey];

    const mainContainer = document.getElementById("option");

    // create container for this domain
    const domainContainer = document.createElement("div");
    domainContainer.id = OptionDomain+"Option";
    
    // add header
    const header = document.createElement("span");
    header.textContent = OptionDomain+" :";
    domainContainer.appendChild(header);

    // create radios
    keys.forEach((key, i) => {
        const label = document.createElement("label");
        label.className = "btn";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = OptionDomain;
        input.value = key;
        if (i === initialKey) input.checked = true;

        const span = document.createElement("span");
        span.textContent = key;

        input.addEventListener("change", () => {
            if (input.checked) onChange(key);
        });

        label.appendChild(input);
        label.appendChild(span);
        domainContainer.appendChild(label);

        // add separator except after last label
        if (i < keys.length - 1) {
            domainContainer.appendChild(document.createTextNode(" | "));
        }
    });

    mainContainer.appendChild(domainContainer);

    // trigger initial callback
    onChange(currentKey);
}

export function setupCheckbox(OptionDomain, onChange, initialValue = false) {
    const mainContainer = document.getElementById("option");

    const domainContainer = document.createElement("div");
    domainContainer.id = OptionDomain+"Option";

    // add header
    const header = document.createElement("span");
    header.textContent = OptionDomain+" ";
    domainContainer.appendChild(header);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = initialValue;
    input.name = OptionDomain;

    input.addEventListener("change", () => onChange(input.checked));

    domainContainer.appendChild(input);
    mainContainer.appendChild(domainContainer);

    // trigger initial callback
    onChange(initialValue);
}
