import React from 'react';
import { PaperEdition, ReaderProfile } from '../types';

interface PrintNewspaperTemplateProps {
  edition: PaperEdition;
  profile: ReaderProfile;
}

export const PrintNewspaperTemplate: React.FC<PrintNewspaperTemplateProps> = ({ edition, profile }) => {
  return (
    <div id="printable-newspaper" style={{ display: 'none' }}>
      {/* Newspaper Masthead */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #222', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #222', paddingBottom: '6px', marginBottom: '8px' }}>
          <span>{edition.dateStr}</span>
          <span>{edition.weather.city} — {edition.weather.temp}, {edition.weather.condition}</span>
          <span>PRICE: PRICELESS / FOR YOUR EYES ONLY</span>
        </div>

        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '3px', color: '#8c1d1d', fontWeight: 700 }}>
          The Daily Morning Broadsheet
        </div>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', margin: '4px 0 6px', letterSpacing: '1px' }}>
          {profile.newspaperName || 'The Morning Chronicle'}
        </h1>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '1.25rem', color: '#444' }}>
          "{profile.motto || 'Veritas, Gravitas et Lux'}"
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', borderTop: '1px solid #222', borderBottom: '2px solid #222', padding: '6px 0', marginTop: '10px' }}>
          <span>VOL. {edition.volume} — NO. {edition.issue}</span>
          <span>CURATED FOR: {profile.name.toUpperCase()}</span>
          <span>ROUTINE: {profile.readingTime.toUpperCase()} • TONE: {profile.tone.toUpperCase()}</span>
        </div>
      </div>

      {/* Chief Editor Dispatch Banner */}
      <div style={{ border: '1px solid #222', backgroundColor: '#f5f2e9', padding: '12px 16px', marginBottom: '18px' }}>
        <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#8c1d1d', marginBottom: '4px' }}>
          From The Chief Editor's Desk • Morning Address
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
          {edition.chiefEditorNote.headline}
        </div>
        <p style={{ fontSize: '12.5px', fontStyle: 'italic', lineHeight: 1.5, color: '#333', margin: 0 }}>
          {edition.chiefEditorNote.narrative}
        </p>
      </div>

      {/* Front Page Lead Story & Side Stories */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', borderBottom: '2px solid #222', paddingBottom: '20px', marginBottom: '20px' }}>
        {/* Lead Story */}
        <div style={{ borderRight: '1px solid #ccc', paddingRight: '20px' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', color: '#8c1d1d', letterSpacing: '1px', marginBottom: '4px' }}>
            Front Page Anchor • {edition.leadArticle.category}
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.85rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '8px' }}>
            {edition.leadArticle.title}
          </h2>
          <div style={{ fontStyle: 'italic', fontSize: '13px', color: '#555', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '6px' }}>
            {edition.leadArticle.subhead}
          </div>
          <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
            By <strong>{edition.leadArticle.author}</strong> • {edition.leadArticle.outlet}
          </div>

          <div style={{ fontSize: '13px', lineHeight: 1.65, textAlign: 'justify' }}>
            <p style={{ marginBottom: '10px' }}>
              <span style={{ float: 'left', fontFamily: "'Cinzel', serif", fontSize: '2.8rem', lineHeight: 0.8, paddingRight: '8px', paddingTop: '2px', fontWeight: 700 }}>
                {edition.leadArticle.leadParagraph.charAt(0)}
              </span>
              {edition.leadArticle.leadParagraph.slice(1)}
            </p>

            {edition.leadArticle.fullBody.slice(0, 2).map((p, idx) => (
              <p key={idx} style={{ marginBottom: '10px' }}>{p}</p>
            ))}

            {edition.leadArticle.pullQuote && (
              <div style={{ borderTop: '2px solid #222', borderBottom: '2px solid #222', padding: '10px 14px', margin: '14px 0', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 700, fontSize: '13.5px', textAlign: 'center', color: '#8c1d1d' }}>
                "{edition.leadArticle.pullQuote}"
              </div>
            )}
          </div>
        </div>

        {/* Side Stories Column */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #222', paddingBottom: '4px', marginBottom: '12px' }}>
            Morning Dispatches
          </div>

          {edition.frontPageSideArticles.map(art => (
            <div key={art.id} style={{ marginBottom: '16px', borderBottom: '1px dotted #ccc', paddingBottom: '12px' }}>
              <div style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', color: '#1e4d2b' }}>
                {art.category}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.25, margin: '4px 0' }}>
                {art.title}
              </h3>
              <p style={{ fontSize: '11.5px', color: '#444', lineHeight: 1.45, margin: 0 }}>
                {art.subhead}
              </p>
              <div style={{ fontSize: '10px', color: '#777', marginTop: '4px' }}>
                {art.outlet} • {art.readingMinutes}m read
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nuance Lens Section on Print */}
      {edition.leadArticle.nuancePerspective && (
        <div style={{ border: '1px solid #222', padding: '14px', backgroundColor: '#f9f7f1', marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#8c1d1d', marginBottom: '8px' }}>
            The Nuance Lens • Multi-Perspective Synthesis
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', fontSize: '11.5px', lineHeight: 1.45 }}>
            <div style={{ borderRight: '1px solid #ddd', paddingRight: '10px' }}>
              <strong style={{ color: '#8c1d1d', display: 'block', marginBottom: '4px' }}>
                {edition.leadArticle.nuancePerspective.label1}
              </strong>
              {edition.leadArticle.nuancePerspective.view1}
            </div>
            <div style={{ borderRight: '1px solid #ddd', paddingRight: '10px' }}>
              <strong style={{ color: '#8c1d1d', display: 'block', marginBottom: '4px' }}>
                {edition.leadArticle.nuancePerspective.label2}
              </strong>
              {edition.leadArticle.nuancePerspective.view2}
            </div>
            <div>
              <strong style={{ color: '#8c1d1d', display: 'block', marginBottom: '4px' }}>
                {edition.leadArticle.nuancePerspective.label3}
              </strong>
              {edition.leadArticle.nuancePerspective.view3}
            </div>
          </div>
        </div>
      )}

      {/* Coffee Break Section on Print */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', border: '1px solid #222', padding: '14px', backgroundColor: '#faf8f2' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            The Coffee Break • Daily Dilemma
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '12.5px', margin: '4px 0 6px' }}>
            "{edition.coffeeBreak.riddle}"
          </p>
          <div style={{ fontSize: '10.5px', color: '#666' }}>
            Solution: <strong>{edition.coffeeBreak.answer}</strong>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#1e4d2b', marginBottom: '4px' }}>
            Word of the Morning: {edition.coffeeBreak.wordOfDay.word}
          </div>
          <div style={{ fontSize: '11.5px', fontStyle: 'italic', color: '#444' }}>
            {edition.coffeeBreak.wordOfDay.definition}
          </div>
          <div style={{ fontSize: '10px', color: '#777', marginTop: '4px' }}>
            {edition.coffeeBreak.factOfTheDay}
          </div>
        </div>
      </div>

      {/* Newspaper Print Footer */}
      <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '2px solid #222', paddingTop: '10px', fontSize: '11px', color: '#666' }}>
        <div>"{edition.morningQuote.quote}" — {edition.morningQuote.author}</div>
        <div style={{ marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '9.5px' }}>
          Personal Morning Paper • Handcrafted for {profile.name} • End of Edition
        </div>
      </div>
    </div>
  );
};
