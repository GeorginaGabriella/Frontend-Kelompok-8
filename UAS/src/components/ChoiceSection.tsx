import React from "react";
import SectionContainer from "./SectionContainer";
import Button from "./Button";

interface ChoiceSectionProps {
  choices: string[];
  onRemoveChoice: (name: string) => void;
  children?: React.ReactNode;
}

/**
 * Komponen Fungsional ChoiceSection (Poin 10 & Poin 11: Functional Component, Props & Children)
 */
export default function ChoiceSection({
  choices,
  onRemoveChoice,
  children,
}: ChoiceSectionProps) {
  return (
    <SectionContainer id="pilihan" className="choice-section">
      <div className="choice-header">
        <div>
          <p className="section-label">PILIHANMU</p>
          <h2>Pilihan Saya</h2>
        </div>

        <div className="choice-counter">
          <span id="choiceCounter">{choices.length}</span>
          <small>menu dipilih</small>
        </div>
      </div>

      <div className="choice-box">
        {choices.length === 0 ? (
          <div className="empty-choice" id="pesanKosong">
            <div className="empty-icon">🍽️</div>
            <h3>Belum ada menu pilihan</h3>
            <p>
              Klik tombol &quot;+ Tambah&quot; pada menu untuk memasukkannya ke
              daftar pilihan.
            </p>

            <Button
              href="#menu"
              variant="primary"
              className="small-button"
              label="Jelajahi Menu"
            />
          </div>
        ) : (
          <ul id="daftarPilihan">
            {choices.map((name, index) => (
              <li key={name}>
                <div className="choice-name">
                  <span className="choice-number">{index + 1}</span>
                  <span>{name}</span>
                </div>
                <button
                  type="button"
                  className="hapus"
                  data-name={name}
                  onClick={() => onRemoveChoice(name)}
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </SectionContainer>
  );
}
