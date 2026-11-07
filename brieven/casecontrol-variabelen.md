# Dynamische velden CaseControl — volledige tweede lijst

Letterlijke veldnamen uit de aangeleverde screenshots, per oorspronkelijke categorie. Niet opgeschoond of samengevoegd.

## Debiteur

```text
{{debtor.name}}
{{debtor.general_name}}
{{debtor.doing_business_as}}
{{debtor.doing_business_as_with_type}}
{{debtor.initials}}
{{debtor.first_name}}
{{debtor.middle_name}}
{{debtor.last_name}}
{{debtor.street}}
{{debtor.house_no}}
{{debtor.house_no_suffix}}
{{debtor.zipcode}}
{{debtor.city}}
{{debtor.province}}
{{debtor.country}}
{{debtor.country_iso2}}
{{debtor.email_address}}
{{debtor.phone_number}}
{{debtor.mobile_number}}
{{debtor.date_of_birth}}
{{debtor.chamber_of_commerce_number}}
{{debtor.tax_number}}
{{debtor.correspondence_title}}
{{debtor.correspondence_suffix}}
{{debtor.correspondence_attention_of_merged}}
{{debtor.correspondence_greeting_merged}}
{{debtor.correspondence_salutation_merged}}
{{debtor.relation_reference_number}}
{{debtor.legal_entity}}
{{debtor.legal_entity_group}}
{{debtor.debtor_portal_username}}
{{debtor.debtor_portal_password}}
{{debtor.registered_office}}
{{debtor.termination_date}}
{{debtor.entity_role}}
{{debtor.trade_name_type}}
{{debtor.relation_id}}
{{debtor.general_relation_id}}
```

## Contactpersoon debiteur

```text
{{debtor_contact_person.full_name}}
{{debtor_contact_person.initials}}
{{debtor_contact_person.first_name}}
{{debtor_contact_person.middle_name}}
{{debtor_contact_person.last_name}}
{{debtor_contact_person.date_of_birth}}
{{debtor_contact_person.place_of_birth}}
{{debtor_contact_person.gender}}
{{debtor_contact_person.street}}
{{debtor_contact_person.house_no}}
{{debtor_contact_person.house_no_suffix}}
{{debtor_contact_person.zipcode}}
{{debtor_contact_person.city}}
{{debtor_contact_person.province}}
{{debtor_contact_person.country}}
{{debtor_contact_person.country_iso2}}
{{debtor_contact_person.correspondence_title}}
{{debtor_contact_person.correspondence_suffix}}
{{debtor_contact_person.correspondence_attention_of_merged}}
{{debtor_contact_person.correspondence_greeting_merged}}
{{debtor_contact_person.correspondence_salutation_merged}}
```

## Debiteuren

```text
{{debtors.name}}
{{debtors.name_multiline}}
{{debtors.correspondence_salutation_merged}}
{{debtors.correspondence_attention_of_merged}}
{{debtors.correspondence_greeting_merged}}
{{debtors.name_format_2}}
{{debtors.name_format_3}}
{{debtors.detail_block_v1}}
{{debtors.detail_block_v2}}
```

## Gebruiker

```text
{{user.initials}}
{{user.first_name}}
{{user.middle_name}}
{{user.last_name}}
{{user.employee_short_code}}
{{user.job_title}}
{{user.title}}
{{user.title_suffix}}
{{user.role}}
{{user.street_address}}
{{user.zipcode}}
{{user.city}}
{{user.country}}
{{user.postal_street}}
{{user.postal_zipcode}}
{{user.postal_city}}
{{user.postal_country}}
{{user.direct_phone}}
{{user.mobile_phone}}
{{user.email}}
{{user.department}}
{{user.phone_number_department}}
{{user.email_department}}
{{user.fax_number_department}}
{{user.date_of_birth}}
{{user.date_of_employeement}}
{{user.signature_image}}
{{user.signature_text}}
{{user.signature_body}}
```

## Afzender

```text
{{sender.initials}}
{{sender.first_name}}
{{sender.middle_name}}
{{sender.last_name}}
{{sender.employee_short_code}}
{{sender.direct_phone}}
{{sender.mobile_phone}}
{{sender.email}}
{{sender.department}}
{{sender.signature_image}}
{{sender.signature_text}}
{{sender.signature_body}}
{{sender.title}}
{{sender.title_suffix}}
{{sender.role}}
{{sender.job_title}}
{{sender.phone_number_department}}
{{sender.email_department}}
{{sender.fax_number_department}}
```

## Eigen bankrekening

```text
{{org_business_bank_account.bank_name}}
{{org_business_bank_account.bic}}
{{org_business_bank_account.iban}}
{{org_business_bank_account.account_name}}
{{org_business_bank_account.memo}}
```

## Eigen derdenrekening

```text
{{org_escrow_bank_account.bank_name}}
{{org_escrow_bank_account.bic}}
{{org_escrow_bank_account.iban}}
{{org_escrow_bank_account.account_name}}
{{org_escrow_bank_account.memo}}
```

## Eigen bezoekadres

```text
{{org_visiting_address.street}}
{{org_visiting_address.house_no}}
{{org_visiting_address.house_no_suffix}}
{{org_visiting_address.zipcode}}
{{org_visiting_address.city}}
{{org_visiting_address.province}}
{{org_visiting_address.country}}
```

## Eigen postadres

```text
{{org_postal_address.street}}
{{org_postal_address.house_no}}
{{org_postal_address.house_no_suffix}}
{{org_postal_address.zipcode}}
{{org_postal_address.city}}
{{org_postal_address.province}}
{{org_postal_address.country}}
```

## Eigen communicatiekanalen

```text
{{org_communication.email}}
{{org_communication.telephone}}
{{org_communication.website}}
```

## Eigen registraties

```text
{{org_registration.chamber_of_commerce_number}}
{{org_registration.vat_number}}
{{org_registration.establishment_number}}
{{org_registration.geo_location}}
{{org_registration.business_license_number}}
```

## Betalingen

```text
{{payments.payment_type}}
{{payments.date_paid}}
{{payments.from_account_number}}
{{payments.to_account_number}}
{{payments.currency}}
{{payments.amount_paid}}
{{payments.amount_last_paid_to_escrow}}
{{payments.amount_total_paid_to_escrow}}
```

## Betalingen in vreemde valuta

```text
{{payments_fc.currency}}
{{payments_fc.amount_paid}}
{{payments_fc.amount_last_paid_to_escrow}}
{{payments_fc.amount_total_paid_to_escrow}}
```

## Betalingsregeling

```text
{{payment_plan.create_date}}
{{payment_plan.total_to_settle}}
{{payment_plan.current_balance}}
{{payment_plan.number_of_terms}}
{{payment_plan.fixed_amount_per_term}}
{{payment_plan.date_first_term_due}}
{{payment_plan.monthly_day_number}}
{{payment_plan.next_term_due_amount}}
{{payment_plan.next_term_due_date}}
{{payment_plan.next_term_balance_amount}}
{{payment_plan.next_term_interest_amount}}
{{payment_plan.due_amount}}
{{payment_plan.previous_term_due_amount}}
{{payment_plan.previous_term_due_date}}
{{payment_plan.previous_term_balance_amount}}
{{payment_plan.previous_term_interest_amount}}
{{payment_plan.next_term_due_days}}
{{payment_plan.is_running_behind}}
{{payment_plan.date_last_term_due}}
```

## Details betalingsregeling

```text
{{payment_plan_details.no}}
{{payment_plan_details.total_payment_plan_balance}}
{{payment_plan_details.installment_amount}}
{{payment_plan_details.payment_plan_balance}}
{{payment_plan_details.installment_date}}
```

## Betalingstoezegging

```text
{{promise_to_pay.promised_amount}}
```

## Weekdagen

```text
{{weekdays.today_plus_2_days}}
{{weekdays.today_plus_3_days}}
{{weekdays.today_plus_5_days}}
{{weekdays.today_plus_7_days}}
{{weekdays.today_plus_14_days}}
{{weekdays.today_plus_30_days}}
```

## Diversen

```text
{{misc.today}}
{{misc.year}}
{{misc.today_plus_2_business_days}}
{{misc.today_plus_3_business_days}}
{{misc.today_plus_5_business_days}}
{{misc.today_plus_7_business_days}}
{{misc.today_plus_14_business_days}}
{{misc.today_plus_30_business_days}}
{{misc.current_time_is_am}}
{{misc.payments_with_settlement_table}}
{{misc.payments_with_settlement_table_v2}}
{{misc.payment_plan_table}}
{{misc.payment_plan_table_v2}}
{{misc.payment_plan_table_v3}}
{{misc.payment_plan_table_v4}}
{{misc.creditor_new_cases_today}}
{{misc.creditor_new_cases_today_refnmbr}}
{{misc.creditor_new_cases_last_7_days}}
{{misc.case_cost_specification}}
{{misc.case_cost_specification_v2}}
{{misc.case_original_claims}}
{{misc.case_original_claims_v2}}
{{misc.case_original_claims_v3}}
{{misc.case_original_claims_unpaid}}
{{misc.case_original_claims_unpaid_v2}}
{{misc.case_original_claims_unpaid_v3}}
{{misc.chargeable_costs_table}}
{{misc.always_page_break_after}}
{{misc.relation_type_name}}
{{misc.creditor_portal_url}}
{{misc.debtor_portal_url}}
{{misc.case_all_claims}}
```

## Branchespecifiek

```text
{{specials.days_installment}}
{{specials.month_term_sale}}
{{specials.repay_total}}
```

## Onderpanden

```text
{{assets.street}}
{{assets.house_no}}
{{assets.house_no_suffix}}
{{assets.zipcode}}
{{assets.city}}
{{assets.province}}
{{assets.country}}
{{assets.country_iso2}}
```

## Declaratie

```text
{{invoice.person_name}}
{{invoice.address_contact_person}}
{{invoice.address_street}}
{{invoice.address_house_no}}
{{invoice.address_house_no_suffix}}
{{invoice.address_zipcode}}
{{invoice.address_city}}
{{invoice.address_province}}
{{invoice.address_country}}
{{invoice.letter_logo_file}}
{{invoice.invoice_number}}
{{invoice.creation_date}}
{{invoice.status}}
{{invoice.due_date}}
{{invoice.invoice_type}}
{{invoice.case_number}}
{{invoice.coc_number}}
{{invoice.case_reference_number}}
{{invoice.tax_number}}
{{invoice.vat_number}}
{{invoice.invoice_body}}
{{invoice.purchase_order_number}}
```

## Tijdregistratie

```text
{{time_registration.total_time_spend}}
{{time_registration.total_invoiceable_amount}}
{{time_registration.billable_hours}}
{{time_registration.billable_agent_name}}
{{time_registration.billable_description}}
{{time_registration.billable_date}}
{{time_registration.billable_time}}
{{time_registration.billable_tariff_per_hour}}
{{time_registration.billable_invoicable_amount}}
{{time_registration.billable_time_label}}
{{time_registration.billable_minutes}}
{{time_registration.billable_total_time_spend}}
{{time_registration.billable_total_minutes_spend}}
{{time_registration.non_billable_hours}}
{{time_registration.non_billable_agent_name}}
{{time_registration.non_billable_description}}
{{time_registration.non_billable_date}}
{{time_registration.non_billable_time}}
{{time_registration.non_billable_time_label}}
{{time_registration.non_billable_minutes}}
{{time_registration.non_billable_total_time_spend}}
{{time_registration.non_billable_total_minutes_spend}}
```

## UDF prefix Belresultaten

```text
{{udf.belresultaat_1}}
{{udf.belresultaat_2}}
{{udf.toezegging_uitkomst}}
```

## UDF prefix Dispuut

```text
{{udf.dispuut_reden}}
{{udf.dispuut_beoordeling}}
{{udf.dispuut_uitkomst}}
```

## UDF prefix Pre-incasso

```text
{{udf.pre_incasso_uitkomst}}
```

## Tekstblokken

```text
{{text_block.email_header}}
{{text_block.email_footer}}
{{text_block.debtor_portal}}
```

## Logo's

```text
{{logo.app_logo}}
{{logo.letter_logo}}
{{logo.report_logo}}
```

**Totaal: 291 velden in 27 categorieën.**
