import React, { useState } from 'react';
import daneUslugi from '../data.json';
import styles from './Calculator.module.scss';

// W moim programie skupiłem się na funkcjonalności, można bez problemu zmieniać ceny, zawsze wylicza najkorzystniejszą cenę dla klienta
// W programie użyłem zmiennych po polsku ze względu na to, że model danych od klienta najprawdopodobniej byłby po polsku, proszę nie traktować tego jako błąd;)

function Calculator() {
  const [wybraneUslugi, setWybraneUslugi] = useState([]);
  const [wybraneLata, setWybraneLata] = useState([]);

  const obliczCene = () => {
    let cena = 0;
    const wybranoPakietInternetTelewizja = wybraneUslugi.includes("Internet") && wybraneUslugi.includes("Telewizja");
    const wybranoPakietInternetAbonament = wybraneUslugi.includes("Internet") && wybraneUslugi.includes("Abonament telefoniczny");

    let cenaPakietInternetTelewizjaPlusAbonament = 0;
    let cenaPakietInternetAbonamentPlusTelewizja = 0;
  
    if (wybranoPakietInternetTelewizja || wybranoPakietInternetAbonament) {
      const nazwaPakietu = wybranoPakietInternetTelewizja ? "Internet + telewizja" : "Internet + Abonament telefoniczny";
      const cenaPakietu = daneUslugi.pakiety.find((pakiet) => pakiet.nazwa === nazwaPakietu).ceny;

      if(wybraneUslugi.includes("Dekoder 4K") && !wybraneUslugi.includes("Telewizja")){
        cena = 0;
      } else if (wybraneUslugi.includes("Internet") && wybraneUslugi.includes("Telewizja") && wybraneUslugi.includes("Abonament telefoniczny")){
        wybraneLata.forEach((rok) => {
          cenaPakietInternetTelewizjaPlusAbonament = cenaPakietInternetTelewizjaPlusAbonament + daneUslugi.pakiety.find((pakiet) => pakiet.nazwa === "Internet + telewizja").ceny[rok] + daneUslugi.uslugi.find((item) => item.nazwa === "Abonament telefoniczny").ceny[rok];
          cenaPakietInternetAbonamentPlusTelewizja = cenaPakietInternetAbonamentPlusTelewizja + daneUslugi.pakiety.find((pakiet) => pakiet.nazwa === "Internet + Abonament telefoniczny").ceny[rok] + daneUslugi.uslugi.find((item) => item.nazwa === "Telewizja").ceny[rok];

          const lowerPrice = cenaPakietInternetTelewizjaPlusAbonament > cenaPakietInternetAbonamentPlusTelewizja ? cenaPakietInternetAbonamentPlusTelewizja : cenaPakietInternetTelewizjaPlusAbonament;
          cena = lowerPrice;
        });
      } else {
        wybraneLata.forEach((rok) => {
          cena += cenaPakietu[rok];
        });
      }
    } else {

      if(wybraneUslugi.includes("Dekoder 4K") && !wybraneUslugi.includes("Telewizja")){
        cena = 0;
      } else {
        wybraneUslugi.forEach((usluga) => {
          const cenaUslugi = daneUslugi.uslugi.find((item) => item.nazwa === usluga).ceny;
    
          wybraneLata.forEach((rok) => {
            cena += cenaUslugi[rok];
          });
        });
      }
    }
  
    return cena;
  };

  const handleUslugaChange = (usluga) => {
    if (wybraneUslugi.includes(usluga)) {
      setWybraneUslugi(wybraneUslugi.filter((item) => item !== usluga));
    } else {
      setWybraneUslugi([...wybraneUslugi, usluga]);
    }
  };

  const handleRokChange = (rok) => {
    if (wybraneLata.includes(rok)) {
      setWybraneLata(wybraneLata.filter((item) => item !== rok));
    } else {
      setWybraneLata([...wybraneLata, rok]);
    }
  };

  return (
    <div>
      <h2>Wybierz usługi:</h2>
      {daneUslugi.uslugi.map((usluga, index) => (
        <div key={index}>
          <label>
            <input
              type="checkbox"
              checked={wybraneUslugi.includes(usluga.nazwa)}
              onChange={() => handleUslugaChange(usluga.nazwa)}
            />
            {usluga.nazwa}
          </label>
        </div>
      ))}

      <h2>Wybierz rok:</h2>
      {Object.keys(daneUslugi.uslugi[0].ceny).map((rok) => (
        <div key={rok}>
          <label>
            <input
              type="checkbox"
              checked={wybraneLata.includes(rok)}
              onChange={() => handleRokChange(rok)}
            />
            {rok}
          </label>
        </div>
      ))}

      <h2 className={styles.totalPrice}>Cena: {obliczCene()} zł</h2>

      {(wybraneUslugi.includes("Dekoder 4K") && !wybraneUslugi.includes("Telewizja")) &&
        <p className={styles.warning}>Nie można wybrać Dekodera 4K bez Telewizji</p>
      }
    </div>
  );
}

export default Calculator;
