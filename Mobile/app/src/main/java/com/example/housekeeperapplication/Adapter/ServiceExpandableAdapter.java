package com.example.housekeeperapplication.Adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.CheckBox;
import android.widget.ExpandableListView;
import android.widget.TextView;

import com.example.housekeeperapplication.Model.Service;
import com.example.housekeeperapplication.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ServiceExpandableAdapter extends BaseExpandableListAdapter {
    private Context context;
    private List<ServiceTypeGroup> groupList;
    private Map<Integer, Boolean> childCheckStates;
    private Map<Integer, Service> serviceMap;
    private ExpandableListViewHeightListener heightListener;
    private OnServiceSelectionChangeListener selectionChangeListener;

    public interface ExpandableListViewHeightListener {
        void onHeightChanged(int newHeight);
    }

    public interface OnServiceSelectionChangeListener {
        void onServiceSelectionChanged(List<Service> selectedServices);
    }

    public ServiceExpandableAdapter(Context context, List<Service> services, ExpandableListViewHeightListener listener) {
        this.context = context;
        this.childCheckStates = new HashMap<>();
        this.serviceMap = new HashMap<>();
        this.groupList = processData(services);
        this.heightListener = listener;
        initializeCheckStates(services);
    }

    public void setOnServiceSelectionChangeListener(OnServiceSelectionChangeListener listener) {
        this.selectionChangeListener = listener;
    }

    private List<ServiceTypeGroup> processData(List<Service> services) {
        Map<String, ServiceTypeGroup> groupMap = new HashMap<>();
        serviceMap.clear();

        for (Service service : services) {
            serviceMap.put(service.getServiceID(), service);
            String typeName = service.getServiceType().getServiceTypeName();
            if (!groupMap.containsKey(typeName)) {
                groupMap.put(typeName, new ServiceTypeGroup(typeName, new ArrayList<>()));
            }
            groupMap.get(typeName).addService(service);
        }

        return new ArrayList<>(groupMap.values());
    }

    private void initializeCheckStates(List<Service> services) {
        for (Service service : services) {
            childCheckStates.put(service.getServiceID(), false);
        }
    }

    @Override
    public int getGroupCount() {
        return groupList != null ? groupList.size() : 0;
    }

    @Override
    public int getChildrenCount(int groupPosition) {
        if (groupList == null || groupPosition >= groupList.size()) {
            return 0;
        }
        return groupList.get(groupPosition).getServices().size();
    }

    @Override
    public Object getGroup(int groupPosition) {
        return groupList.get(groupPosition);
    }

    @Override
    public Object getChild(int groupPosition, int childPosition) {
        return groupList.get(groupPosition).getServices().get(childPosition);
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return groupList.get(groupPosition).getServices().get(childPosition).getServiceID();
    }

    @Override
    public boolean hasStableIds() {
        return true;
    }

    @Override
    public View getGroupView(int groupPosition, boolean isExpanded, View convertView, ViewGroup parent) {
        GroupViewHolder holder;
        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.expandable_group_item, parent, false);
            holder = new GroupViewHolder(convertView);
            convertView.setTag(holder);
        } else {
            holder = (GroupViewHolder) convertView.getTag();
        }

        ServiceTypeGroup group = (ServiceTypeGroup) getGroup(groupPosition);
        holder.tvGroupTitle.setText(group.getTypeName());
        holder.tvArrow.setText(isExpanded ? "▼" : "▶");

        // Đếm số dịch vụ đã chọn trong nhóm này
        int selectedCount = 0;
        for (Service service : group.getServices()) {
            if (Boolean.TRUE.equals(childCheckStates.get(service.getServiceID()))) {
                selectedCount++;
            }
        }

        holder.tvSelectedCount.setVisibility(selectedCount > 0 ? View.VISIBLE : View.GONE);
        holder.tvSelectedCount.setText(String.format("(%d)", selectedCount));

        return convertView;
    }

    @Override
    public View getChildView(int groupPosition, int childPosition, boolean isLastChild, View convertView, ViewGroup parent) {
        ChildViewHolder holder;
        if (convertView == null) {
            convertView = LayoutInflater.from(context).inflate(R.layout.expandable_child_item, parent, false);
            holder = new ChildViewHolder(convertView);
            convertView.setTag(holder);
        } else {
            holder = (ChildViewHolder) convertView.getTag();
        }

        Service service = (Service) getChild(groupPosition, childPosition);
        holder.cbService.setText(service.getServiceName());
        holder.tvPrice.setText(String.format("%,d VND", (int) service.getPrice()));

        // Đặt trạng thái checked ban đầu
        holder.cbService.setChecked(Boolean.TRUE.equals(childCheckStates.get(service.getServiceID())));

        // Xử lý sự kiện thay đổi trạng thái
        holder.cbService.setOnCheckedChangeListener((buttonView, checked) -> {
            childCheckStates.put(service.getServiceID(), checked);
            notifySelectionChanged();
            notifyDataSetChanged();

            // Cập nhật chiều cao của ExpandableListView
            if (heightListener != null) {
                heightListener.onHeightChanged(calculateTotalHeight((ExpandableListView) parent));
            }
        });

        return convertView;
    }

    private void notifySelectionChanged() {
        if (selectionChangeListener != null) {
            selectionChangeListener.onServiceSelectionChanged(getSelectedServices());
        }
    }

    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }

    public List<Integer> getSelectedServiceIds() {
        List<Integer> selectedIds = new ArrayList<>();
        for (Map.Entry<Integer, Boolean> entry : childCheckStates.entrySet()) {
            if (entry.getValue()) {
                selectedIds.add(entry.getKey());
            }
        }
        return selectedIds;
    }

    public List<Service> getSelectedServices() {
        List<Service> selectedServices = new ArrayList<>();
        for (Map.Entry<Integer, Boolean> entry : childCheckStates.entrySet()) {
            if (entry.getValue() && serviceMap.containsKey(entry.getKey())) {
                selectedServices.add(serviceMap.get(entry.getKey()));
            }
        }
        return selectedServices;
    }

    public void setServiceChecked(int serviceId, boolean isChecked) {
        childCheckStates.put(serviceId, isChecked);
        notifyDataSetChanged();
        notifySelectionChanged();
    }

    public int calculateTotalHeight(ExpandableListView listView) {
        int totalHeight = 0;
        int groupCount = getGroupCount();

        // Chiều cao của tiêu đề
        View listHeader = listView.getChildAt(0);
        if (listHeader != null) {
            totalHeight += listHeader.getHeight();
        }

        for (int i = 0; i < groupCount; i++) {
            View groupView = getGroupView(i, false, null, listView);
            groupView.measure(
                    View.MeasureSpec.makeMeasureSpec(listView.getWidth(), View.MeasureSpec.EXACTLY),
                    View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED)
            );
            totalHeight += groupView.getMeasuredHeight();

            if (listView.isGroupExpanded(i)) {
                int childrenCount = getChildrenCount(i);
                for (int j = 0; j < childrenCount; j++) {
                    View childView = getChildView(i, j, false, null, listView);
                    childView.measure(
                            View.MeasureSpec.makeMeasureSpec(listView.getWidth(), View.MeasureSpec.EXACTLY),
                            View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED)
                    );
                    totalHeight += childView.getMeasuredHeight();
                }
            }
        }

        // Thêm divider height
        totalHeight += listView.getDividerHeight() * (groupCount - 1);

        return totalHeight;
    }

    // ViewHolder cho group item
    private static class GroupViewHolder {
        TextView tvGroupTitle;
        TextView tvArrow;
        TextView tvSelectedCount;

        GroupViewHolder(View view) {
            tvGroupTitle = view.findViewById(R.id.tvGroupTitle);
            tvArrow = view.findViewById(R.id.tvArrow);
            tvSelectedCount = view.findViewById(R.id.tvSelectedCount);
        }
    }

    // ViewHolder cho child item
    private static class ChildViewHolder {
        CheckBox cbService;
        TextView tvPrice;

        ChildViewHolder(View view) {
            cbService = view.findViewById(R.id.cbService);
            tvPrice = view.findViewById(R.id.tvPrice);
        }
    }

    public static class ServiceTypeGroup {
        private final String typeName;
        private final List<Service> services;

        public ServiceTypeGroup(String typeName, List<Service> services) {
            this.typeName = typeName;
            this.services = services;
        }

        public void addService(Service service) {
            this.services.add(service);
        }

        public String getTypeName() {
            return typeName;
        }

        public List<Service> getServices() {
            return services;
        }
    }
}