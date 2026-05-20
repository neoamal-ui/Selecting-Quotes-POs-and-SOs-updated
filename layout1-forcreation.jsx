
  /* ════════════════════════════════════════════════════════════
     LAYOUT 1 — Current (baseline)
     ════════════════════════════════════════════════════════════ */
  const renderLayout1 = () => (
    <div className="quote-page-enter" style={{ display: 'flex', height: '100%', overflow: 'hidden', background: '#f5f4f0' }}>
      <div style={{ flex: '0 0 45%', minWidth: 0, borderRight: '1px solid #e5e5e5', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div className="qp-header" style={{ ...headerBar, gap: 10 }}>
          {backBtn}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: '#a3a3a3', cursor: 'pointer' }}>Quotes & Invoices</span>
            <ChevronRight size={12} color="#c5c5c5" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#262626' }}>{data.id}</span>
          </div>
        </div>
        <QuoteStatusTimeline timeline={data.statusTimeline} />
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 40px' }}>
          {sectionHead('Customer', 'billed')}
          {sectionWrap('billed', (
            <div style={{ padding: '16px 0' }}>
              <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                {['organization', 'customer'].map(v => (
                  <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#374151' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${billedTo === v ? '#262626' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
                      {billedTo === v && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#262626' }} />}
                    </div>
                    {v === 'organization' ? 'Organization' : 'Customer'}
                  </label>
                ))}
              </div>
              <label style={labelStyle}>{billedTo === 'organization' ? 'Organization name' : 'Contact name'}</label>
              <div style={{ position: 'relative' }}>
                <input value={billedTo === 'organization' ? orgName : contactName} onChange={e => billedTo === 'organization' ? setOrgName(e.target.value) : setContactName(e.target.value)} style={inputStyle} />
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', cursor: 'pointer', display: 'flex' }}><PencilIcon /></span>
              </div>
            </div>
          ))}
          {sectionHead('Quote details', 'details')}
          {sectionWrap('details', (
            <div style={{ padding: '16px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div><label style={labelStyle}>Quote date</label><input type="date" value={quoteDate} onChange={e => setQuoteDate(e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Valid until</label><input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={inputStyle} /></div>
              </div>
              <label style={labelStyle}>PO number (optional)</label>
              <input value={poNumber} onChange={e => setPoNumber(e.target.value)} placeholder="Enter PO number" style={inputStyle} />
            </div>
          ))}
          {sectionHead('Deposit required', 'deposit')}
          {sectionWrap('deposit', (
            <div style={{ padding: '16px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 16 }}>
                <div onClick={() => setDepositRequired(!depositRequired)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${depositRequired ? '#262626' : '#d1d5db'}`, background: depositRequired ? '#262626' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
                  {depositRequired && <CheckIcon size={12} color="#fff" />}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>Deposit required</span>
              </label>
              {depositRequired && (
                <>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                    {['percentage', 'fixed'].map(v => (
                      <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#374151' }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${depositType === v ? '#262626' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 180ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
                          {depositType === v && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#262626' }} />}
                        </div>
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                      </label>
                    ))}
                  </div>
                  <label style={labelStyle}>Deposit value</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a3a3a3', fontSize: 13 }}>{depositType === 'percentage' ? '%' : '$'}</span>
                    <input value={depositValue} onChange={e => setDepositValue(e.target.value)} style={{ ...inputStyle, paddingLeft: 30 }} />
                  </div>
                </>
              )}
            </div>
          ))}
          {sectionHead('Show prices to customer', 'prices')}
          {sectionWrap('prices', (
            <div style={{ padding: '16px 0' }}><CustomerViewToggles /></div>
          ))}
          {sectionHead('Notes & terms', 'notes')}
          {sectionWrap('notes', (
            <div style={{ padding: '16px 0' }}>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes or terms visible on the quote..." rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
          ))}
        </div>
        <div style={{ flexShrink: 0, padding: '12px 20px', borderTop: '1px solid #f0eeea', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn-press" onClick={onBack} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#374151' }}>Cancel</button>
          <button className="btn-press" style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#262626', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#fff' }}>Save changes</button>
        </div>
      </div>

      <div style={{ flex: '0 0 55%', minWidth: 0, display: 'flex', flexDirection: 'column', background: '#f5f4f0', overflow: 'hidden', position: 'relative' }}>
        <div className="qp-header" style={{ ...headerBar, justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#262626' }}>Preview</span>
          {statusBadge}
        </div>
        <div className="preview-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 80px' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <QuoteDocCard data={data} items={lineItems} formState={formState} />
          </div>
        </div>
        <div className="floating-bar" style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', background: '#fff', borderRadius: 12, border: '1px solid #e5e5e5', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', zIndex: 20 }}>
          <button className="btn-press" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, border: 'none', background: '#262626', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#fff' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
            Send
          </button>
          <button className="btn-press btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#262626' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download PDF
          </button>
          <button className="btn-press btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#262626' }}>
            <PrinterIcon />
            Print
          </button>
          <div ref={createRef} style={{ position: 'relative' }}>
            <button className="btn-press btn-ghost" onClick={() => setCreateOpen(p => !p)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, border: '1px solid #e5e5e5', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#262626' }}>
              New
              <ChevronDown size={13} color="#737373" />
            </button>
            {createOpen && (
              <div className="dropdown-enter-up" style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: 6, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 150, zIndex: 50, padding: '4px 0' }}>
                {['New quote', 'New invoice', 'New job'].map(item => (
                  <button className="dropdown-item" key={item} onClick={() => setCreateOpen(false)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 16px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: '#262626', fontWeight: 500 }}>{item}</button>
                ))}
              </div>
            )}
          </div>
          <OverflowMenu items={overflowItems} />
        </div>
      </div>
    </div>
  );
